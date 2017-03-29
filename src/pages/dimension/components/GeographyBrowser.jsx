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
        const dimension = this.props.dimension;
        const isGeography = dimension.type && dimension.type === 'geography' || false;

        if (!isGeography) {
            return null;
        }

        // const renderParam = this.props.location.query.render;
        // if (renderParam == 'simple') {
        //     return this.renderSimpleSelector();
        // }

        return this.renderTypeLinks();
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