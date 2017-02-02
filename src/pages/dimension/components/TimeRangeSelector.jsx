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
        this.onSelectBoxChange = this.onSelectBoxChange.bind(this);
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

    onSelectBoxChange(data) {
        console.log(data);
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
            const options = rangeData[rangeType];
            const props = {
                id: rangeType,
                label: rangeType,
                inline: true,
                hideLabel: true,
                onChange: this.onSelectBoxChange,
                options
            }
            return (
                <fieldset key={rangeType}>
                    <legend>Select a {rangeType}</legend>
                    <SelectBox {...props} />
                </fieldset>
                
            )
        });
        return fieldSets;
    }
}

TimeRangeSelector.propTypes = propTypes;