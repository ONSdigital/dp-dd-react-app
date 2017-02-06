import React, { Component } from 'react';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router';
import Radio from '../../../components/elements/RadioButton';
import TimeRangeSelector from './TimeRangeSelector';

import { saveDimensionOptions } from '../../dataset/actions';
import { requestHierarchical } from '../../dataset/actions';
import { renderFlatHierarchy } from '../utils';
import { deselectAllOptions, selectAllOptions } from '../../dataset/actions';

class TimeSelector extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedInterval: 'month',
            selectedOptions: [] // should either contain 1 item for single date of 2 for range
        };
        this.onIntervalRadioChange = this.onIntervalRadioChange.bind(this);
        this.onRangeChange = this.onRangeChange.bind(this);
        this.onAddButtonClick = this.onAddButtonClick.bind(this);
    }

    onIntervalRadioChange(event) {
        this.setState({selectedInterval: event.value});
    }

    onRangeChange(optionIndex) {
        return optionData => {
            const selectedOptions = this.state.selectedOptions;
            selectedOptions[optionIndex] = optionData;
            this.setState({ selectedOptions });
        }
    }

    getOptionRage({list, range}) {
        let { index, startIndex, endIndex } = -1;
        const options = [];
        list.forEach((item, index) => {
            if (startIndex > -1 && endIndex == -1) {
                options.push({ id: item.id, selected: true });
            }

            range.forEach(rangeItem => {
                if (rangeItem.id === item.id) {
                    if (startIndex === -1) {
                        options.push({ id: item.id, selected: true })
                    } else if (startIndex > 1) {
                        endIndex = index;
                        options.push({ id: item.id, selected: true });
                    }
                }
            });
        })

        return options;
    }

    onAddButtonClick() {
        // todo: store it, allright? No need to re-iterate over it again and again
        let options = [];
        const selectedOptions = this.state.selectedOptions;

        if (selectedOptions.length === 0) {
            throw new Error("missing selection");
        }

        options.push(selectedOptions[0]);

        if (selectedOptions.length > 1) {
            options = this.getOptionRage({
                list: renderFlatHierarchy({
                    hierarchy: this.props.options,
                    filter: {selected: true},
                }),
                range: selectedOptions
            });
        }

        options.forEach(option => option.selected = true);
        this.props.dispatch(saveDimensionOptions({
            dimensionID: this.props.dimensionID,
            options
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
        ownProps.dispatch(requestHierarchical(dataset.id, dimension.id));
    } else if (dimension.hierarchyReady && !dimension.edited) {
        this.props.dispatch(deselectAllOptions(this.props.dimensionID))
    }

    return {
        options: dimension.options,
        isReady: dimension.hierarchyReady
    }
}

export default connect(mapStateToProps)(TimeSelector)