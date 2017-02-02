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

    groupOptionsByType(options) {
        const groupedOptions = {}
        options.forEach(option => {
            const levelType = option.levelType;
            if (!groupedOptions[levelType.code]) {
                groupedOptions[levelType.code]={
                    levelType,
                    options: []
                };
            }
            groupedOptions[levelType.code].options.push({
                id: option.id,
                value: option.name,
                type: levelType.name
            });
        });
        return groupedOptions;
    }

    onSelectBoxChange(levelType) {
        return data => {
            const selectedCodes = this.state.selectedCodes.slice();
            selectedCodes[levelType.level] = levelType.code;
            this.setState({ selectedCodes: selectedCodes });
        }
    }

    render() {
        return (
            <div>
                {this.renderRange(this.props.options)}
            </div>
        )
    }

    renderRange(options) {
        const optionGroups  = this.groupOptionsByType(options);
        const rangeTypes = Object.keys(optionGroups);
        const fieldSets = rangeTypes.map(rangeType => {
            const optionGroup = optionGroups[rangeType];
            const props = {
                id: rangeType,
                label: rangeType,
                inline: true,
                hideLabel: true,
                onChange: this.onSelectBoxChange(optionGroup.levelType),
                options: optionGroup.options,
            }
            const elements = (
                <fieldset key={rangeType}>
                    <legend>Select a {rangeType}</legend>
                    <SelectBox {...props} />
                </fieldset>

            )
            return elements;
        });
        return fieldSets;
    }
}

TimeRangeSelector.propTypes = propTypes;