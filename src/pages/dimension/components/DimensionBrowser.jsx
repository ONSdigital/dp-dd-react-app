import React, { Component, PropTypes } from 'react';
import { Link, hashHistory } from 'react-router';
import { connect } from 'react-redux';
import { findOptionByID, findOptionsByType } from '../utils';
import SimpleSelector from './SimpleSelector';
import HierarchySelector from './HierarchySelector';

import {
    requestMetadata,
    requestDimensions
} from '../../dataset/actions';

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
            return dispatch(requestMetadata(this.props.params.id));
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

        if (!this.props.hasDimensions || !options) {
            return null;
        }

        if (!isNested) {
            return this.renderOptionLinks();
        }

        if (!optionsAreParents) {
            return this.renderSimpleSelector();
        }

        if (isGeography) {
            return this.renderOptionLinks();
        }

        return this.renderHierarchySelector();
    }

    renderHierarchySelector() {
        const hierarchyProps = this.getChildComponentProps();
        hierarchyProps.option = this.props.option;
        return <HierarchySelector {...hierarchyProps} />
    }

    renderSimpleSelector() {
        const selectorProps = this.getChildComponentProps();
        return <SimpleSelector {...selectorProps} />
    }

    renderOptionLinks () {
        const pathname = this.props.location.pathname;
        const action = this.props.location.query.action;
        const options = this.props.option ? this.props.option.options : this.props.options;

        const optionElements = options.map((option, index) => {
            const query = {
                action,
                id: option.id
            };
            let label = option.name;
            if (option.optionsType) {
                label = `${option.optionsType} in ${option.name}`;
            }
            if (option.options) {
                label += ` (${option.options.length})`;
            }
            let info = option.options && option.options.length > 0 ?`For example ${option.options[0].name}` : '';
            return (
                <div key={index} className="margin-top">
                    <Link to={{ pathname, query }}>{label}</Link><br />
                    <span>{info}</span>
                </div>
            )
        })

        return (
            <div className="margin-bottom--8">
                <h2 className="margin-top margin-bottom">Customise location</h2>
                {optionElements}
            </div>
        )
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