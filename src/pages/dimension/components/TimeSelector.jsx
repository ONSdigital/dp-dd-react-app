import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import Radio from '../../../components/elements/RadioButton';
import TimeRangeSelector from './TimeRangeSelector';

import { saveDimensionOptions } from '../../dataset/actions';
import { renderFlatListOfOptions } from '../utils';

class TimeSelector extends Component {

    constructor(props) {
        super(props);
        this.state = {
            requestedOptionsUpdate: false,
            requestedDeselectAll: false,
            selectedInterval: this.getIntervalValue(),
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

    getRangeOfOptions({list, range}) {
        const retOptions = [];
        let startIndex = -1;
        let endIndex = -1;

        list.forEach((item, index) => {
            if (startIndex > -1 && endIndex == -1) {
                console.log(item.id, item.id, startIndex, endIndex);
                retOptions.push({ id: item.id, selected: true });
            }

            range.forEach((rangeItem) => {
                if (rangeItem.id === item.id) {
                    if (startIndex === -1) {
                        startIndex = index;
                        retOptions.push({ id: item.id, selected: true });
                    } else if (startIndex > 1) {
                        endIndex = index;
                        retOptions.push({ id: item.id, selected: true });
                    }
                    console.log(item.id, rangeItem.id, startIndex, endIndex);
                }
            });
        });

        console.log('Found range:', retOptions);
        return retOptions;
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
            const list = renderFlatListOfOptions({
                hierarchy: this.props.options,
                filter: { /* select all */ },
            });

            options = this.getRangeOfOptions({
                range: selectedOptions,
                list
            });
        }

        options.forEach(option => option.selected = true);

        this.props.dispatch(saveDimensionOptions({
            dimensionID: this.props.dimensionID,
            options
        }));

        this.props.router.push({
            pathname: this.props.location.pathname,
            query: {
                action: 'summary'
            }
        })
    }

    getIntervalValue() {
        const options = this.props.options;
        let intervalLabel;

        if (options[0].options) {
            intervalLabel = options[0].options[0].levelType.name;
        } else {
            intervalLabel = options[0].levelType.name;
        }

        return intervalLabel;
    }

    render() {
        if (!this.props.isReady || !this.props.isEdited) {
            return null;
        }
        const selectedInterval = this.state.selectedInterval;
        const intervalLabel = this.getIntervalValue();
        const intervalSelector = [
            { id: intervalLabel, value: intervalLabel, label: 'Single ' + intervalLabel },
            { id: 'range', value: 'range', label: 'Range' }
        ];

        this.getIntervalValue();

        console.log(this.props.options);

        return (
            <form className="form">
                <h1 className="margin-top--4 margin-bottom">Add a single month or range</h1>
                <div className="margin-top-md--1 margin-bottom-md--2">
                {intervalSelector.map((radio, index) => {
                    return <Radio key={index}  {...radio} onChange={this.onIntervalRadioChange}
                                  group={'interval-selector'} checked={selectedInterval === radio.value} inline={true}/>
                })}
                </div>

                {this.renderTimeSelector()}

                <div className="margin-top--4 margin-bottom--8">
                    <a className="btn btn--primary btn--thick btn--wide btn--big margin-right--half" onClick={this.onAddButtonClick}>Add</a>
                    <br/>
                    <a className="inline-block margin-top--4 font-size--17" onClick={browserHistory.goBack}>Cancel</a>
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
                <div>
                    <h3>Start date</h3>
                    <TimeRangeSelector options={this.props.options} onChange={this.onRangeChange(0)} />
                </div>
                <div>
                    <h3>End date</h3>
                    <TimeRangeSelector options={this.props.options} onChange={this.onRangeChange(1)} />
                </div>
            </div>
        )
    }
}

function mapStateToProps(state, ownProps) {
    const dataset = state.dataset;
    const dimension = dataset.dimensions.find((dimension) => {
        return dimension.id === ownProps.dimensionID;
    });

    const props = {
        options: dimension.options,
        dimensionId: ownProps.dimensionID
    }

    return props;
}

export default connect(mapStateToProps)(TimeSelector)