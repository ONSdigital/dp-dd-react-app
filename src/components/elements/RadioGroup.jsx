import React, {Component, PropTypes} from 'react';
import Radio from './RadioButton';

/* Questions:
1. Is my way of building up the radios okay? Ie a map through props and returning the map which in turn returns a React DOM element
2. The radios prop contains an object, I should probably
 */

const propTypes = {
    radioData: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired
    })).isRequired,
    groupName: PropTypes.string.isRequired,
    selectedValue: PropTypes.string
};

export default class RadioGroup extends Component {
    constructor(props) {
        super(props);

        this.state = {selectedValue: this.props.selectedValue};

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.setState({selectedValue: event.value});
    }

    render() {
        const radioData = this.props.radioData;
        const groupName = this.props.groupName;
        const selectedValue = this.state.selectedValue;

        return (
            <div>
                {
                    radioData.map((radio, index) => {
                        return <Radio key={index} {...radio} group={groupName} onChange={this.handleChange} checked={selectedValue === radio.value}/>
                    })
                }
            </div>
        )
    }
}

RadioGroup.propTypes = propTypes;