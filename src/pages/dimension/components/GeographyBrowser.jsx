import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import SimpleSelector from './SimpleSelector';

import { dropLastPathComponent } from '../../../common/helpers';
import { requestVersionMetadata } from '../../dataset/actions';
import {
    findOptionByID,
    getBrowseList,
    getEntriesOfType,
    getEntriesWithLeafType
} from '../utils/querying';

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
        const dimension = this.props.dimension;
        const isGeography = dimension.type && dimension.type === 'geography' || false;

        if (!isGeography) {
            return null;
        }

        if (this.props.location.query.type) {
            return this.renderOptionsOfTypeLinks();
        }

        return this.renderTypeLinks();
    }

    // todo: move to static component
    renderTypeLinks() {
        const pathname = this.props.location.pathname;
        const action = this.props.location.query.action;
        const parentPath = dropLastPathComponent(pathname);
        const dimension = this.props.dimension;
        const optionTypeMap = dimension.optionTypeMap;
        const entryTypeMap = dimension.entryTypeMap;
        const levelTypeMap = dimension.levelTypeMap;
        const geographyLinks = [];

        for (var [key, value] of optionTypeMap.entries()) {
            const query = {
                action,
                type: value.id
            };

            const optionName = levelTypeMap.get(key).values().next().value.name;
            const summary = `For example: ${optionName}`;

            geographyLinks.push(
                <p key={key} className="margin-top">
                    <Link to={{ pathname, query }}>{value.name}</Link><br />
                    <span>{summary}</span>
                </p>
            );
        }

        return (
            <div className="margin-bottom--8">
                <h1 className="margin-top--4 margin-bottom">Browse {this.props.dimensionID}</h1>
                {geographyLinks}
                <br/>
                <Link className="inline-block font-size--17" to={parentPath}>Cancel</Link>
            </div>
        )
    }

    // todo: move to static component
    renderOptionsOfTypeLinks() {
        const pathname = this.props.location.pathname;
        const action = this.props.location.query.action;
        const parentPath = dropLastPathComponent(pathname);
        const dimension = this.props.dimension;
        const entryMap = dimension.entryMap;
        const optionTypeMap = dimension.optionTypeMap;
        const entryTypeMap = dimension.entryTypeMap;
        const levelTypeMap = dimension.levelTypeMap;

        const leafType = this.props.location.query.type;
        const leafId = this.props.location.query.id;
        const leafHierarchyId = this.props.location.query.hierarchyId;

        const optionSet = levelTypeMap.get(leafType);
        const topLevelItems = getBrowseList(optionSet);

        const combinedEntryId = leafHierarchyId + ':' + leafId;
        const entries = !leafId ? topLevelItems : new Set(this.props.dimension.entryMap.get(combinedEntryId).options);

        const checkBoxItems = getEntriesOfType(leafType, entries)
        const linkItems = getEntriesWithLeafType(leafType, entries)

        // todo: implement displaying links and checkboxes on the same page
        if (checkBoxItems.size > 0) {
            const selectorProps = {
                router: this.props.router,
                datasetID: this.props.params.id,
                dimensionID: this.props.params.dimensionID,
                options: Array.from(checkBoxItems),
                onSave: () => {
                    this.props.router.push({
                        pathname: this.props.location.pathname,
                        query: {
                            action: 'summary'
                        }
                    })
                }
            }

            return <SimpleSelector {...selectorProps} />
        }

        const geographyLinks = [];
        if (linkItems.size > 0) {
            for (let [item] of linkItems.entries()) {
                const query = {
                    action,
                    id: item.id,
                    hierarchyId: item.hierarchy_id,
                    type: leafType
                };

                const combinedEntryId = item.hierarchy_id + ':' + item.id;
                const optionName = entryMap.get(combinedEntryId).options[0].name;
                const summary = `For example: ${optionName}`;

                geographyLinks.push(
                    <p key={item.id} className="margin-top">
                        <Link to={{ pathname, query }}>{item.name}</Link><br />
                        <span>{summary}</span>
                    </p>
                );
            }
        }

        return (
            <div className="margin-bottom--8">
                <h1 className="margin-top--4 margin-bottom">Browse {this.props.dimensionID}</h1>
                {geographyLinks}
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
}

GeographyBrowser.propTypes = propTypes;

function mapStateToProps(state, ownProps) {
    const dimension = state.dimension;
    const optionID = ownProps.location.query.id || null;
    const option = !optionID ? null : findOptionByID({ options: dimension.options, id: optionID });
    return { dimension, optionID, option };
}

export default connect(mapStateToProps)(GeographyBrowser);