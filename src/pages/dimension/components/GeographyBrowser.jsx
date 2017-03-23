import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import SimpleSelector from './SimpleSelector';

import { findOptionByID } from '../utils/querying';
import { dropLastPathComponent } from '../../../common/helpers';
import { requestVersionMetadata } from '../../dataset/actions';

const propTypes = {
    dimensionID: PropTypes.string.isRequired,
    datasetID: PropTypes.string.isRequired,
    location: PropTypes.object.isRequired,
    option: PropTypes.object,
    options: PropTypes.array
}

class GeographyBrowser extends Component {
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
        const isGeography = this.props.type && this.props.type === 'geography' || false;
        const renderParam = this.props.location.query.render;

        if (!isGeography) {
            return null;
        }

        if (renderParam == 'simple') {
            return this.renderSimpleSelector();
        }

        return this.renderGeographyLinks();
    }

    renderSimpleSelector() {
        const geogTypeCode = this.props.location.query.type;
        const selectorProps = {
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

        if (geogTypeCode) {
            selectorProps.options = this.getAllGeographiesByType(geogTypeCode);
        }

        return <SimpleSelector {...selectorProps} />
    }

    renderGeographyLinks() {
        const pathname = this.props.location.pathname;
        const action = this.props.location.query.action;
        const parentPath = dropLastPathComponent(pathname);
        const areaList = this.buildGeographyBrowseList();

        const optionElements = areaList.map((option, index) => {
            const query = {
                action,
                id: option.parentId,
                render: 'simple',
                type: option.typeCode
            };

            return (
                <p key={index} className="margin-top">
                    <Link to={{ pathname, query }}>{option.name}</Link><br />
                    <span>{option.summary}</span>
                </p>
            )
        })

        return (
            <div className="margin-bottom--8">
                <h1 className="margin-top--4 margin-bottom">Browse {this.props.dimensionID}</h1>
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
            const info = option.options && option.options.length > 0 ?`For example ${option.options[0].name}` : '';
            const query = { action,  id: option.id };

            let label = !option.optionsType ? option.name : `${option.optionsType} in ${option.name}`;
            if (option.options) {
                label += ` (${option.options.length})`;
            }

            return (
                <p key={index} className="margin-top">
                    <Link to={{ pathname, query }}>{label}</Link><br />
                    <span>{info}</span>
                </p>
            )
        });

        return (
            <div className="margin-bottom--8">
                <h1 className="margin-top--4 margin-bottom">Browse {this.props.dimensionID}</h1>
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
                    const code = option.levelType.id;

                    const summary = `For example: ${option.name}`;
                    const area = {id, parentId, name, summary, typeCode: code};
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
}

GeographyBrowser.propTypes = propTypes;

function mapStateToProps(state, ownProps) {
    const dimension = state.dimension;
    const optionID = ownProps.location.query.id || null;

    const props = {};
    props.dimension = dimension;
    props.optionsCount = dimension.optionsCount;
    props.options = dimension.options;
    props.option = optionID ? findOptionByID({ options: dimension.options, id: optionID }) : null;
    return props;
}

export default connect(mapStateToProps)(GeographyBrowser);