import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import {
    requestMetadata,
    requestDimensions,
    saveDimensionOptions
} from './actions';

import DimensionList from '../../components/elements/DimensionList';
import DimensionSelector from '../../components/elements/DimensionSelector';
import DocumentTitle from '../../components/elements/DocumentTitle';

class Customise extends Component {
    constructor(props) {
        super(props)
        this.state = {
            initialFetchRequired: false,
            parentPath: '/dd/dataset/AF001EW/',
            currentPath: '/dd/dataset/AF001EW/customise/'
        }

        this.saveDimensionOptions = this.saveDimensionOptions.bind(this);
    }

    saveDimensionOptions({dimensionID, options}) {
        this.props.dispatch(saveDimensionOptions({dimensionID, options}));
        this.props.router.push(this.state.currentPath);
    }

    componentWillMount() {
        const dispatch = this.props.dispatch;
        if (!this.props.title) {
            this.state.initialFetchRequired = true;
            return dispatch(requestMetadata(this.props.params.id));
        }
        dispatch(requestDimensions(this.props.params.id));
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
        if (this.props.params.dimensionID === undefined) {
            return this.renderDimensionList();
        }
        return this.renderDimensionSelector();
    }

    renderDimensionList() {
        const parentPath = this.state.parentPath;
        const dimensions = this.props.dimensions;

        if (!this.props.hasMetadata) {
            return null;
        }

        return (
            <div>
                <div className="margin-top--2">
                    <Link to={parentPath} className="btn--everything">Back</Link>
                    <DocumentTitle title={`Customise ${this.props.title}`}>
                        <h1 className="margin-top--half margin-bottom">Customise this dataset</h1>
                    </DocumentTitle>

                </div>
                <div>
                    <DimensionList dimensions={dimensions} />
                    <div className="margin-top--4 margin-bottom--8">
                        <a className="btn btn--primary btn--thick btn--wide btn--big margin-right--half"
                           href="download.html">Choose a download format &gt;</a>
                        <Link className="btn btn--secondary btn--thick btn--wide btn--big"
                              to="/dd/dataset/AF001EW">Cancel</Link>
                    </div>
                </div>
            </div>
        )
    }

    renderDimensionSelector() {
        if (!this.props.hasDimensions) {
            return null;
        }

        const parentPath = this.state.currentPath;
        const dimension = this.props.dimensions.find((dimension) => {
            return dimension.id === this.props.params.dimensionID;
        });

        const selectorProps = {
            options: dimension.options,
            dimensionID:  this.props.params.dimensionID,
            saveSelections: this.saveDimensionOptions,
            type: dimension.type
        }

        return (
            <div>
                <div className="margin-top--2">
                    <Link to={parentPath} className="btn--everything">Back</Link>
                </div>
                <div>
                    <DimensionSelector {...selectorProps} />
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        dimensions: state.dataset.dimensions,
        title: state.dataset.title,
        hasDimensions: state.dataset.hasDimensions,
        hasMetadata: state.dataset.hasMetadata
    }
}

export default connect(mapStateToProps)(Customise)