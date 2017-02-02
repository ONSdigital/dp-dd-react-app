import React, {Component, PropTypes} from 'react'
import SelectBox from '../../../components/elements/SelectBox';

const propTypes = {
    options: PropTypes.array.isRequired
}

export default class TimeRangeSelector extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedCodes: []
        }
    }

    parseOptionsAsKeyValueData(options) {
        const rangeData = {}
        options.forEach(option => {
            const typeData = option.levelType;
            if (!rangeData[typeData.code]) {
                rangeData[typeData.code]=[];
            }
            rangeData[typeData.code].push({
                id: option.id,
                value: option.name,
                type: typeData.name
            });
        });
        return rangeData;
    }

    render() {
        return (
            <div>
                {this.renderRange(this.props.options)}
            </div>
        )
    }

    renderRange(options) {
        const rangeData  = this.parseOptionsAsKeyValueData(options);
        const rangeTypes = Object.keys(rangeData);
        const fieldSets = rangeTypes.map(rangeType => {
            const data = rangeData[rangeType];
            return (
                <fieldset key={rangeType}>
                    <legend>Select a {rangeType}</legend>
                    <SelectBox id={rangeType} label={rangeType} options={data} inline={true} hideLabel={true} />
                </fieldset>
                
            )
        });
        return fieldSets;
    }
}

TimeRangeSelector.propTypes = propTypes;