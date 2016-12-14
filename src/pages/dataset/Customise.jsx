import React, { Component } from 'react'
import { connect } from 'react-redux'
import { requestDimensions } from './actions'
import { Link } from 'react-router'
import DimensionList from '../../components/elements/DimensionList'
import DimensionSelector from '../../components/elements/DimensionSelector'

class Customise extends Component {
    constructor(props) {
        super(props)
    }

    componentWillMount() {
        const dispatch = this.props.dispatch;
        dispatch(requestDimensions(this.props.params.id));
    }

    getOptions() {
        let options = [];
        this.props.dimensions.forEach((dimension) => {
            if (dimension.id === this.props.params.dimensionID) {
                options = dimension.options;
            }
        })
        return options;
    }

    render() {
        if (this.props.params.dimensionID === undefined) {
            return this.renderDimensionList();
        }
        return this.renderDimensionSelector();
    }

    renderDimensionList() {
        const title = "Customise this dataset";
        const parentPath = '/dd/dataset/AF001EW/';
        const dimensions = this.props.dimensions.map((dimension) => {
            return Object.assign({}, dimension, {
                selected: 'nothing selected'
            })
        })

        return (
            <div>
                <div className="margin-top--2">
                    <Link to={parentPath} className="btn--everything">Back</Link>
                    <h1 className="margin-top--half margin-bottom">{title}</h1>
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
        const parentPath = '/dd/dataset/AF001EW/customise/';
        const params = this.props.params;

        return (
            <div>
                <div className="margin-top--2">
                    <Link to={parentPath} className="btn--everything">Back</Link>
                </div>
                <div>
                    <DimensionSelector options={this.getOptions()} selectorID={params.dimensionID}/>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        dimensions: state.dataset.dimensions
    }
}

export default connect(mapStateToProps)(Customise)