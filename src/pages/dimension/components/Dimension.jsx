import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import config from '../../../config';
import DocumentTitle from '../../../components/elements/DocumentTitle';

import HierarchyNavigator from '../../dimension/components/HierarchyNavigator';
import SimpleSelector from './SimpleSelector';
import TimeSelector from './TimeSelector';

import DimensionBrowser from './DimensionBrowser';
import DimensionSearch from './DimensionSearch';
import SelectionSummary from './SelectionSummary';

import { requestMetadata, requestDimensions } from '../../dataset/actions';
import { requestHierarchical } from '../../dataset/actions';
import { deselectAllOptions, selectAllOptions } from '../../dataset/actions';

const propTypes = {
    datasetID: PropTypes.string.isRequired,
    dimensionID: PropTypes.string,
    hasDimensions: PropTypes.bool.isRequired,
    hasMetadata: PropTypes.bool.isRequired,
    title: PropTypes.string,
    dimensionName: PropTypes.string,
    type: PropTypes.string,
    isEdited: PropTypes.bool,
    isReady: PropTypes.bool,
    isHierarchical: PropTypes.bool
};

class Dimension extends Component {
    constructor(props) {
        super(props);
        this.state = {
            parentPath: `${config.BASE_PATH}/datasets/${this.props.params.id}/`,
            currentPath: `${config.BASE_PATH}/datasets/${this.props.params.id}/dimensions`,
            downloadPath: `${config.BASE_PATH}/datasets/${this.props.params.id}/download`,
            requestedOptionsUpdate: false,
            requestedDeselectAll: false

        }
    }

    componentWillMount() {
        this.requestDimensionUpdate();
    }

    componentWillReceiveProps(nextProps) {
        this.requestDimensionUpdate(nextProps);
    }

    requestDimensionUpdate(props = this.props) {
        const isEdited = props.isEdited;
        const isReady = props.isReady;
        const isHierarchical = props.isHierarchical;
        const dispatch = props.dispatch;
        const datasetID = props.datasetID;
        const dimensionID = props.dimensionID;
        const state = this.state;

        if (!props.hasMetadata) {
            dispatch(requestMetadata(this.props.params.id));
            return;
        }

        if (!props.hasDimensions) {
            dispatch(requestDimensions(this.props.params.id));
            return;
        }

        if (!isReady && isHierarchical && !state.requestedOptionsUpdate) {
            state.requestedOptionsUpdate = true;
            dispatch(requestHierarchical(datasetID, dimensionID));
            return;
        }

        if (isReady && !isEdited && !state.requestedDeselectAll && isHierarchical) {
            state.requestedDeselectAll = true;
            dispatch(deselectAllOptions(this.props.dimensionID));
            return;
        }
    }

    render() {

        if (!this.props.hasDimensions || !this.props.isReady) {
            return null;
        }
        if (this.props.isReady && !this.props.isEdited && this.props.isHierarchical) {
            return null;
        }

        return (
            <div className="wrapper">
                <div className="margin-top--double">
                    <DocumentTitle title={"Customise " + this.props.dimensionName} />
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
        };
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

        let screen = null;
        switch (this.props.type) {
            case 'time':
                screen = <TimeSelector {...componentProps} />;
                break;
            case 'classification':
            case 'geography':
                screen = <HierarchyNavigator {...componentProps} />;
                break;
            default:
                componentProps.router = this.props.router;
                componentProps.onSave =() => this.props.router.push(this.state.currentPath);
                screen = <SimpleSelector {...componentProps} />;
        }

        if (this.props.isEdited && this.props.selectedCount > 0 && action !== 'customise') {
            return <SelectionSummary {...componentProps} />;
        }

        return screen;
    }
}

Dimension.propTypes = propTypes;

function mapStateToProps(state, ownProps) {
    const dataset = state.dataset;
    const hasDimensions = dataset.hasDimensions;
    const dimension = !hasDimensions ? null : dataset.dimensions.find((dimension) => {
        return dimension.id === ownProps.params.dimensionID;
    });

    const props = {
        title: dataset.title,
        datasetID: ownProps.router.params.id,
        dimensionID: ownProps.router.params.dimensionID,
        hasDimensions: dataset.hasDimensions,
        hasMetadata: dataset.hasMetadata
    };

    if (dimension) {
        Object.assign(props, {
            dimensionName: dimension.name,
            type: dimension.type || 'default',
            isEdited: dimension.edited || false,
            isReady: !dimension.hierarchical ? true : dimension.hierarchyReady || false,
            isHierarchical: dimension.hierarchical || false,
            optionsCount: dimension.optionsCount,
            selectedCount: dimension.selectedCount
        });
    }

    return props;
}

export default connect(mapStateToProps)(Dimension);