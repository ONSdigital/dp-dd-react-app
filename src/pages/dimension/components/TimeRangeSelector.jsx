import React, {Component, PropTypes} from 'react'
import SelectBox from '../../../components/elements/SelectBox';

const propTypes = {
    options: PropTypes.array.isRequired,
    onChange: PropTypes.func
}

export default class TimeRangeSelector extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedCodes: [],
            selectedValues: []
        }
        this.onSelectBoxChange = this.onSelectBoxChange.bind(this);
    }

    groupOptionsByType(options) {
        const groupedOptions = {};
        options.forEach(option => {
            const levelType = option.levelType;
            if (!groupedOptions[levelType.code]) {
                groupedOptions[levelType.code]={
                    levelType,
                    options: []
                };
            }
            groupedOptions[levelType.code].options.push(option);
        });
        return groupedOptions;
    }

    onSelectBoxChange(levelType) {
        return data => {
            const selectedCodes = this.state.selectedCodes.slice();
            selectedCodes[levelType.level] = levelType.code;

            const selectedValues = this.state.selectedValues.slice();
            selectedValues[levelType.level] = data.value;

            this.setState({ selectedCodes, selectedValues });
            if (this.props.onChange) {
                const depth = selectedCodes.length - 1;
                const code = selectedCodes[depth];
                const id = selectedValues[depth];
                this.props.onChange({ id, depth, code });
            }
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
        const selectedCodes = this.state.selectedCodes;
        const selectedValues = this.state.selectedValues;
        const fieldSets = rangeTypes.map(rangeType => {
            const optionGroup = optionGroups[rangeType];
            const selectBoxProps = {
                id: rangeType,
                label: rangeType,
                inline: true,
                hideLabel: true,
                onChange: this.onSelectBoxChange(optionGroup.levelType),
                options: optionGroup.options.map(option => ({
                    value: option.id,
                    label: option.name
                }))
            }
            selectBoxProps.options.unshift({value: null});
            const elements = [
                <fieldset key={rangeType}>
                    <legend>Select a {rangeType}</legend>
                    <SelectBox {...selectBoxProps} />
                </fieldset>
            ];

            if (selectedCodes[optionGroup.levelType.level] == optionGroup.levelType.code) {
                const option = optionGroup.options.find(option => {
                    return option.id === selectedValues[optionGroup.levelType.level];
                });
                if (option && option.options) {
                    elements.push(this.renderRange(option.options));
                }
            }
            return elements;
        });
        return fieldSets;
    }
}

TimeRangeSelector.propTypes = propTypes;