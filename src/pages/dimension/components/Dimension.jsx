import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import config from '../../../config';

import Browser from '../../dimension/components/Browser';
import Customisation from '../../dimension/components/HierarchySelector';
import Search from '../../dimension/components/Search';
import Summary from '../../dimension/components/Summary';

import {
    requestMetadata,
    requestDimensions
} from '../../dataset/actions';


import Selector from './SimpleSelector';

const propTypes = {
    hasDimensions: PropTypes.bool.isRequired,
    hasMetadata: PropTypes.bool.isRequired,
    dimensions: PropTypes.array
}

class Dimension extends Component {
    constructor(props) {
        super(props)
        this.state = {
            initialFetchRequired: false,
            parentPath: `${config.BASE_PATH}/datasets/${this.props.params.id}/`,
            currentPath: `${config.BASE_PATH}/datasets/${this.props.params.id}/dimensions`,
            downloadPath: `${config.BASE_PATH}/datasets/${this.props.params.id}/download`
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

    render() {
        const props = this.props;
        if (!props.hasDimensions) return null;
        const defaultProps = {
            datasetID: props.params.id,
            dimensionID: props.params.dimensionID,
            location: props.location
        }
        const componentProps = Object.assign({}, props, defaultProps);

        switch (props.location.query.action) {
            case 'customise':
                return <Customisation {...componentProps} />;
            case 'browse':
                return <Browser {...componentProps} />;
            case 'search':
                return <Search {...componentProps} />;
            case 'summary':
                return <Summary {...componentProps} />;
        }
        return this.renderDimensionSelector();
    }

    renderDimensionSelector() {
        if (!this.props.hasDimensions) {
            return null;
        }

        const parentPath = this.state.currentPath;
        const selectorProps = {
            router: this.props.router,
            datasetID: this.props.params.id,
            dimensionID: this.props.params.dimensionID,
            onSave: () => this.props.router.push(this.state.currentPath)
        }

        return (
            <div>
                <div className="margin-top--2">
                    <Link to={parentPath} className="btn--everything">Back</Link>
                </div>
                <div>
                    <Selector {...selectorProps} />
                </div>
            </div>
        )
    }
}

Dimension.propTypes = propTypes;

function mapStateToProps(state) {
    return {
        dimensions: state.dataset.dimensions,
        title: state.dataset.title,
        hasDimensions: state.dataset.hasDimensions,
        hasMetadata: state.dataset.hasMetadata
    }
}

export default connect(mapStateToProps)(Dimension);