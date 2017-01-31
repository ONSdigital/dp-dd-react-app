import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import config from '../../../config';

import HierarchySelector from '../../dimension/components/HierarchySelector';
import SimpleSelector from './SimpleSelector';
import TimeSelector from './TimeSelector';

import DimensionBrowser from './DimensionBrowser';
import DimensionSearch from './DimensionSearch';
import SelectionSummary from './SelectionSummary';

import { requestMetadata, requestDimensions } from '../../dataset/actions';

const propTypes = {
    type: PropTypes.string.isRequired,
    hasDimensions: PropTypes.bool.isRequired,
    hasMetadata: PropTypes.bool.isRequired
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
        if (!this.props.hasDimensions) {
            return null;
        }

        const parentPath = this.state.currentPath;
        return (
            <div className="wrapper">
                <div className="margin-top--2">
                    <Link to={parentPath} className="btn--everything">Back</Link>
                </div>
                <div>
                    { this.renderDimensionScreen() }
                </div>
            </div>
        )
    }

    renderDimensionScreen() {
        const defaultProps = {
            datasetID: this.props.params.id,
            dimensionID: this.props.params.dimensionID,
            location: this.props.location
        }
        const action = this.props.location.query.action;
        const componentProps = Object.assign({}, this.props, defaultProps);

        if (action) switch (action) {
            case 'browse':
                return <DimensionBrowser {...componentProps} />;
            case 'search':
                return <DimensionSearch {...componentProps} />;
            case 'summary':
                return <SelectionSummary {...componentProps} />;
        }

        switch (this.props.type) {
            case 'time':
                return <TimeSelector {...componentProps} />
            case 'specialisation':
            case 'geography':
                return <HierarchySelector {...componentProps} />;
            default:
                componentProps.router = this.props.router;
                componentProps.onSave =() => this.props.router.push(this.state.currentPath);
                debugger;
                return <SimpleSelector {...componentProps} />;
        }
    }
}

Dimension.propTypes = propTypes;

function mapStateToProps(state, ownProps) {
    const hasDimensions = state.dataset.hasDimensions;
    const dimension = !hasDimensions ? null : state.dataset.dimensions.find((dimension) => {
        return dimension.id === ownProps.params.dimensionID;
    });

    return {
        type: hasDimensions && dimension ? dimension.type : 'default',
        title: state.dataset.title,
        hasDimensions: state.dataset.hasDimensions,
        hasMetadata: state.dataset.hasMetadata
    }
}

export default connect(mapStateToProps)(Dimension);