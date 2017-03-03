import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import SimpleSelector from './SimpleSelector';
import HierarchySelector from './HierarchySelector';

import { findOptionByID } from '../utils';
import { dropLastPathComponent } from '../../../common/helpers';
import { requestVersionMetadata, requestDimensions } from '../../dataset/actions';

const propTypes = {
    dimensionID: PropTypes.string.isRequired,
    datasetID: PropTypes.string.isRequired,
    location: PropTypes.object.isRequired,
    option: PropTypes.object,
    options: PropTypes.array
}

class DimensionBrowser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            initialFetchRequired: false
        }
    }

    componentWillMount() {
        const dispatch = this.props.dispatch;
        if (!this.props.hasMetadata) {
            this.state.initialFetchRequired = true;
            return dispatch(requestVersionMetadata(this.props.params.id));
        }
        if (!this.props.hasDimensions) {
            dispatch(requestDimensions(this.props.params.id));
        }
    }


    shouldComponentUpdate(nextProps) {
        if (this.state.initialFetchRequired) {
            this.state.initialFetchRequired = false;
            nextProps.dispatch(requestDimensions(this.props.params.id));
            return false;
        }
        return true;
    }

    render () {
        const options = this.props.option ? this.props.option.options : this.props.options;
        const optionsAreParents = options instanceof Array && options.length > 0 && !!options[0].options;
        const isNested = !!this.props.location.query.id;
        const isGeography = this.props.type && this.props.type === 'geography' || false;
        const renderParam = this.props.location.query.render;

        if (!this.props.hasDimensions || !options) {
            return null;
        }

        if (isGeography && renderParam == 'simple') {
            return this.renderSimpleSelector();
        }

        if (isGeography) {
            return this.renderGeographyLinks();
        }

        if (!isNested) {
            return this.renderOptionLinks();
        }

        if (!optionsAreParents) {
            return this.renderSimpleSelector();
        }


        return this.renderHierarchySelector();
    }

    renderHierarchySelector() {
        const hierarchyProps = this.getChildComponentProps();
        hierarchyProps.option = this.props.option;
        return <HierarchySelector {...hierarchyProps} />
    }

    renderSimpleSelector() {
        const geogTypeCode = this.props.location.query.type;

        if (geogTypeCode) {
            const geogOptions = this.getAllGeographiesByType(geogTypeCode);
            const selectorProps = {
                router: this.props.router,
                datasetID: this.props.params.id,
                dimensionID: this.props.params.dimensionID,
                options: geogOptions,
                onSave: () => {
                    this.props.router.push({
                        pathname: this.props.location.pathname,
                        query: {
                            action: 'summary'
                        }
                    })
                }
            };
            return <SimpleSelector {...selectorProps} />
        } else {
            const selectorProps = this.getChildComponentProps();
            return <SimpleSelector {...selectorProps} />
        }
    }

    renderGeographyLinks() {
        const pathname = this.props.location.pathname;
        const action = this.props.location.query.action;
        const options = this.props.option ? this.props.option.options : this.props.options;
        const parentPath = dropLastPathComponent(pathname);
        const areaList = this.buildGeographyBrowseList();

        const optionElements = areaList.map((option, index) => {
            const query = {
                action,
                id: option.parentId,
                render: 'simple',
                type: option.typeCode
            };

            const label = option.name;
            const info = option.summary;

            return (
                <p key={index} className="margin-top">
                    <Link to={{ pathname, query }}>{label}</Link><br />
                    <span>{info}</span>
                </p>
            )
        })

        return (
            <div className="margin-bottom--8">
                <h1 className="margin-top--4 margin-bottom">Customise location</h1>
                {optionElements}
                <br/>
                <Link className="inline-block font-size--17" to={parentPath}>Cancel</Link>
            </div>
        )

    }

    renderOptionLinks () {
        const pathname = this.props.location.pathname;
        const action = this.props.location.query.action;
        const options = this.props.option ? this.props.option.options : this.props.options;
        const parentPath = dropLastPathComponent(pathname);

        const optionElements = options.map((option, index) => {
            const query = {
                action,
                id: option.id
            };
            let label = option.name;
            if (option.optionsType)
            label = `${option.optionsType} in ${option.name}`;

            if (option.options) {
                label += ` (${option.options.length})`;
            }
            let info = option.options && option.options.length > 0 ?`For example ${option.options[0].name}` : '';

                 return (
                     <p key={index} className="margin-top">
                         <Link to={{ pathname, query }}>{label}</Link><br />
                         <span>{info}</span>
                     </p>
                 )
        });

        return (
            <div className="margin-bottom--8">
                <h1 className="margin-top--4 margin-bottom">Customise location</h1>
                {optionElements}
                <br/>
                <Link className="inline-block font-size--17" to={parentPath}>Cancel</Link>
            </div>
        )
    }

    buildGeographyBrowseList() {
        const options = this.props.option ? this.props.option.options : this.props.options;
        const areaList = [];

        (function buildAreaGroupsList(options, previousID) {

            options.map(option => {

                if (!option.empty) {

                    const id = option.id;
                    const parentId = previousID;
                    const name = option.levelType.name;
                    let code = null;
                    if (option.levelType.level == 5) {
                        code = option.levelType.id
                    }
                    const summary = `For example: ${option.name}`;
                    const area = {id: id, parentId: parentId, typeCode: code, name: name, summary: summary};
                    const found = areaList.some(function (el) {
                        return el.name === area.name;
                    });
                    if (!found) {areaList.push(area)}
                }

                if (option.options) {
                    buildAreaGroupsList(option.options, option.id)
                }
            });
        })(options);

        return areaList;
    }

    getAllGeographiesByType(type) {
        const options = this.props.dimension.options;
        let geographies = [];

        (function getGeogByType(options) {
            options.map((option, index) => {

                if (option.levelType.id == type) {
                    geographies.push(option);
                }

                if (option.options) {
                    getGeogByType(option.options);
                }
            });
        })(options);

        return geographies;

    }

    getChildComponentProps() {
        return {
            router: this.props.router,
            datasetID: this.props.params.id,
            dimensionID: this.props.params.dimensionID,
            options: this.props.option ? this.props.option.options : this.props.options,
            onSave: () => {
                this.props.router.push({
                    pathname: this.props.location.pathname,
                    query: {
                        action: 'summary'
                    }
                })
            }
        }
    }

}

DimensionBrowser.propTypes = propTypes;

function mapStateToProps(state, ownProps) {
    const dataset = state.dataset;
    const optionID = ownProps.location.query.id || null;
    const dimension = dataset.dimensions.find((dimension) => {
        return dimension.id === ownProps.dimensionID;
    });

    const props = {};
    props.dimension = dimension;
    props.optionsCount = dimension.optionsCount;
    props.options = dimension.options;
    props.option = optionID ? findOptionByID({ options: dimension.options, id: optionID }) : null;

    return props;
}

export default connect(mapStateToProps)(DimensionBrowser);