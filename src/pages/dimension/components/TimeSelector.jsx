import React, { Component } from 'react';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router';
import Radio from '../../../components/elements/RadioButton';
import TimeRangeSelector from './TimeRangeSelector';

import { requestHierarchicalDimension } from '../../dataset/actions';

class TimeSelector extends Component {

    constructor(props) {
        super(props);

        this.state = {
            selectedInterval: 'month',
        };

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.setState({selectedInterval: event.value});
    }


    render() {
        if (!this.props.isReady) {
            return null;
        }

        const intervalSelector = [{
                id: 'month',
                value: 'month',
                label: 'Single month'
            },{
            id: 'range',
            value: 'range',
            label: 'Range'
        }];
        const selectedInterval = this.state.selectedInterval;
        return (
            <form className="form">
                <h2 className="margin-top--half margin-bottom">Add a single month or range</h2>
                <div className="margin-top-md--1 margin-bottom-md--2">
                {intervalSelector.map((radio, index) => {
                    return <Radio key={index}  {...radio} group={'interval-selector'} onChange={this.handleChange}
                                      checked={selectedInterval === radio.value} inline={true}/>
                })}
                </div>

                {this.renderTimeSelector()}

                <div className="margin-top--4 margin-bottom--8">
                    <a className="btn btn--primary btn--thick btn--wide btn--big margin-right--half"
                       onClick="">Add</a>
                    <a className="btn btn--secondary btn--thick btn--wide btn--big" onClick={hashHistory.goBack}>Cancel</a>
                </div>


            </form>
        )
    }


    renderTimeSelector() {
        const selectedInterval = this.state.selectedInterval;
        switch(selectedInterval) {
            case 'month':
                return this.renderMonthSelector();
            default:
                return this.renderRangeSelector();
        }
    }

    renderMonthSelector() {
        return <TimeRangeSelector options={this.props.options} />
    }

    renderRangeSelector() {
        return (
            <div>
                <TimeRangeSelector options={this.props.options} />
                <TimeRangeSelector options={this.props.options} />
            </div>
        )
    }

}

function mapStateToProps(state, ownProps) {
    const dataset = state.dataset;
    const dimension = dataset.dimensions.find((dimension) => {
        return dimension.id === ownProps.dimensionID;
    });
    if (dimension.hierarchical && !dimension.hierarchyReady) {
        ownProps.dispatch(requestHierarchicalDimension(dataset.id, dimension.id));
    }
    return {
        options: dimension.options,
        isReady: dimension.hierarchyReady
    }
}

export default connect(mapStateToProps)(TimeSelector)