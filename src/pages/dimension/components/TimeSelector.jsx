import React, { Component } from 'react';
import { connect } from 'react-redux';
import Radio from '../../../components/elements/RadioButton';
import SelectBox from '../../../components/elements/SelectBox';

class TimeSelector extends Component {

    constructor(props) {
        super(props);

        this.state = {
            selectedInterval: 'range',
        };

        this.handleChange = this.handleChange.bind(this);

    }

    handleChange(event) {
        this.setState({selectedInterval: event.value});
    }


    render() {
        const intervalSelector = [{
                id: 'range',
                value: 'range',
                label: 'Range'
            },{
                id: 'month',
                value: 'month',
                label: 'Single month'
            }];
        const selectedInterval = this.state.selectedInterval;
        return (
            <div>
                <div className="margin-top-md--1 margin-bottom-md--2">
                {
                    intervalSelector.map((radio, index) => {
                        return <Radio key={index}  {...radio} group={'interval-selector'} onChange={this.handleChange}
                                      checked={selectedInterval === radio.value} inline={true}/>
                    })

                }
                </div>

                { this.renderTimeSelector() }


            </div>
        )
    }


    renderTimeSelector() {
        const selectedInterval = this.state.selectedInterval;
        switch(selectedInterval) {
            case 'month':
                return this.renderMonthSelector();
                break;
            default:
                return this.renderRangeSelector();
        }

    }

    renderMonthSelector() {
        const monthOptions = [{id: "MON001", value: 'January'},{id: "MON002", value: 'February'}];
        const yearOptions = [{id: "YEAR001", value: '2017'},{id: "YEAR002", value: '2016'}];
        return (
            <fieldset>
                <legend>Select a month and year</legend>
                <SelectBox label={"Month"} options={monthOptions} inline={true} hideLabel={true}/>
                <SelectBox label={"Year"} options={yearOptions} inline={true} hideLabel={true}/>
            </fieldset>
        )
    }

    renderRangeSelector() {
        const startMonthOptions = [{id: "MON001", value: 'January'},{id: "MON002", value: 'February'}];
        const startYearOptions = [{id: "YEAR001", value: '2001'},{id: "YEAR002", value: '2002'}];
        const endMonthOptions = [{id: "MON001", value: 'January'},{id: "MON002", value: 'February'}];
        const endYearOptions = [{id: "YEAR001", value: '2017'},{id: "YEAR002", value: '2016'}];
        return (
            <div>
                <fieldset className="margin-bottom-md--2">
                    <legend>Select a start date</legend>
                    <SelectBox label={"Month"} options={startMonthOptions} inline={true} hideLabel={true}/>
                    <SelectBox label={"Year"} options={startYearOptions} inline={true} hideLabel={true}/>
                </fieldset>
                <fieldset>
                    <legend>Select an end date</legend>
                    <SelectBox label={"Month"} options={endMonthOptions} inline={true} hideLabel={true}/>
                    <SelectBox label={"Year"} options={endYearOptions} inline={true} hideLabel={true}/>
                </fieldset>
            </div>
        )
    }

}

function mapStateToProps(state) {
    return {

    }
}

export default connect(mapStateToProps)(TimeSelector)