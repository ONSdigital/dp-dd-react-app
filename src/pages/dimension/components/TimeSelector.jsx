import React, { Component } from 'react';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router';
import Radio from '../../../components/elements/RadioButton';
import TimeRangeSelector from './TimeRangeSelector';

import { saveDimensionOptions } from '../../dataset/actions';
import { requestHierarchicalDimension } from '../../dataset/actions';

class TimeSelector extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedInterval: 'month',
            selectedValues: [] // should either contain 1 item for single date of 2 for range
        };
        this.onIntervalRadioChange = this.onIntervalRadioChange.bind(this);
        this.onRangeChange = this.onRangeChange.bind(this);
        this.onAddButtonClick = this.onAddButtonClick.bind(this);
    }

    onIntervalRadioChange(event) {
        this.setState({selectedInterval: event.value});
    }

    onRangeChange(selectedValueIndex) {
        return optionData => {
            const selectedValues = this.state.selectedValues;
            selectedValues[selectedValueIndex] = optionData;
            this.setState({ selectedValues });
        }
    }

    onAddButtonClick() {
        this.props.dispatch(saveDimensionOptions({
            dimensionID: this.props.dimensionID,
            options: this.state.selectedValues
        }));
    }

    render() {
        if (!this.props.isReady) {
            return null;
        }
        const selectedInterval = this.state.selectedInterval;
        const intervalSelector = [
            { id: 'month', value: 'month', label: 'Single month' },
            { id: 'range', value: 'range', label: 'Range' }
        ];

        return (
            <form className="form">
                <h2 className="margin-top--half margin-bottom">Add a single month or range</h2>
                <div className="margin-top-md--1 margin-bottom-md--2">
                {intervalSelector.map((radio, index) => {
                    return <Radio key={index}  {...radio} onChange={this.onIntervalRadioChange}
                                  group={'interval-selector'} checked={selectedInterval === radio.value} inline={true}/>
                })}
                </div>

                {this.renderTimeSelector()}

                <div className="margin-top--4 margin-bottom--8">
                    <a className="btn btn--primary btn--thick btn--wide btn--big margin-right--half" onClick={this.onAddButtonClick}>Add</a>
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
        return <TimeRangeSelector options={this.props.options} onChange={this.onRangeChange(0)} />
    }

    renderRangeSelector() {
        return (
            <div>
                <TimeRangeSelector options={this.props.options} onChange={this.onRangeChange(0)} />
                <TimeRangeSelector options={this.props.options} onChange={this.onRangeChange(1)} />
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