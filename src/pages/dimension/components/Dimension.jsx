import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import DocumentTitle from '../../../components/elements/DocumentTitle';

import HierarchyNavigator from '../../dimension/components/HierarchyNavigator';
import SimpleSelector from './SimpleSelector';
import TimeSelector from './TimeSelector';

import HierarchyBrowser from './HierarchyBrowser';
import GeographyBrowser from './GeographyBrowser';

import DimensionSearch from './DimensionSearch';
import SelectionSummary from './SelectionSummary';

import { replaceLastPathComponent, dropLastPathComponent } from '../../../common/helpers';
import { requestVersionMetadata, requestDimensions } from '../../dataset/actions';
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
        const pathname = props.location.pathname;

        this.state = {
            parentPath: dropLastPathComponent(pathname),
            currentPath: pathname,
            downloadPath: replaceLastPathComponent(pathname, '/download'),
            requestedOptionsUpdate: false
        }

        this.onBrowserBackButtonEvent = this.onBrowserBackButtonEvent.bind(this);
    }

    onBrowserBackButtonEvent (e) {
        e.preventDefault();
        if (this.props.selectedCount === 0) {
            this.props.dispatch(selectAllOptions(this.props.dimensionID, true));
        }
    }

    componentWillUnmount() {
        const handledFromSimpleSelector = this.props.isHierarchical && !this.props.isFlat;
        if (this.props.selectedCount === 0 && handledFromSimpleSelector) {
            this.props.dispatch(selectAllOptions(this.props.dimensionID, true));
        }
    }

    componentDidMount() {
        window.onpopstate = this.onBrowserBackButtonEvent;
    }

    componentWillMount() {
        if (this.requestDimensionUpdate()) {
            this.requestSummaryScreen();
        }
    }

    shouldComponentUpdate(nextProps) {
        if (this.requestDimensionUpdate(nextProps)) {
            return this.requestSummaryScreen(nextProps);
        }
        return false;
    }

    requestDimensionUpdate(props = this.props) {
        const isReady = props.isReady;
        const isHierarchical = props.isHierarchical;
        const autoDeselected = props.autoDeselected;
        const allSelected = props.selectedCount === props.selectableCount;
        const dispatch = props.dispatch;
        const datasetID = props.datasetID;
        const edition = props.params.edition;
        const version = props.params.version;
        const dimensionID = props.dimensionID;
        const state = this.state;

        if (!props.hasMetadata) {
            dispatch(requestVersionMetadata(datasetID, edition, version));
            return false;
        }

        if (!props.hasDimensions) {
            dispatch(requestDimensions(datasetID, edition, version));
            return false;
        }

        if (!isReady && isHierarchical && !state.requestedOptionsUpdate) {
            state.requestedOptionsUpdate = true;
            dispatch(requestHierarchical(datasetID, edition, version, dimensionID));
            return false;
        }

        if (isReady && allSelected && autoDeselected !== true) {
            dispatch(deselectAllOptions(this.props.dimensionID, true));
            return false;
        }

        return true;
    }

    requestSummaryScreen(props = this.props) {
        const action = props.location.query.action;
        const selectedCount = props.selectedCount;
        const isHierarchical = props.isHierarchical;
        const isAutoDeselected = props.autoDeselected === true;
        const isReady = props.isReady;
        const ignoredActions = ['summary', 'customise', 'browse', 'search'];
        const canRedirect = ignoredActions.indexOf(action) === -1;
        const isFlat = props.isFlat;

        if (isReady && isAutoDeselected && isHierarchical && !isFlat && selectedCount > 0 && canRedirect) {
            props.router.push({
                pathname: props.location.pathname,
                query: {
                    action: 'summary'
                }
            });
            return false;
        }

        return true;
    }

    render() {
        if (!this.props.hasDimensions || !this.props.isReady) {
            return null;
        }

        return (
            <div className="wrapper">
                <div>
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
        const dimensionType = this.props.type;

        componentProps.router = this.props.router;
        componentProps.onSave =() => {
            this.props.router.push(this.state.parentPath);
        }

        if (this.props.isFlat) {
            return <SimpleSelector {...componentProps} />;
        }

        if (action) switch (action) {
            case 'browse':
                if (dimensionType === 'geography') {
                    return <GeographyBrowser {...componentProps}/>
                }
                return <HierarchyBrowser {...componentProps} />;
            case 'search':
                return <DimensionSearch {...componentProps} />;
            case 'summary':
                return <SelectionSummary {...componentProps} />;
        }

        switch (this.props.type) {
            case 'time':
                return <TimeSelector {...componentProps} />;
            case 'classification':
            case 'geography':
                return <HierarchyNavigator {...componentProps} />;
            default:
                return <SimpleSelector {...componentProps} />;
        }
    }
}

Dimension.propTypes = propTypes;

function isHierarchyFlat(options) {
    let flatHierarchy = true;
    const length = options.length;
    let index = 0;
    while (index < length && flatHierarchy) {
        if (options[index].options) {
            return false;
        }
        index++;
    }
    return flatHierarchy;
}

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
        version: ownProps.params.version,
        edition: ownProps.params.edition,
        hasDimensions: dataset.hasDimensions,
        hasMetadata: dataset.hasMetadata
    };

    if (dimension) {
        Object.assign(props, {
            dimensionName: dimension.name,
            autoDeselected: dimension.autoDeselected,
            type: dimension.type || 'default',
            isReady: !dimension.hierarchical ? true : dimension.hierarchyReady || false,
            isHierarchical: dimension.hierarchical || false,
            isFlat: isHierarchyFlat(dimension.options),
            optionsCount: dimension.optionsCount,
            selectedCount: dimension.selectedCount,
            selectableCount: dimension.selectableCount
        });
    }

    return props;
}


export default connect(mapStateToProps)(Dimension);