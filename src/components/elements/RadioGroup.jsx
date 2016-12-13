import React, {Component} from 'react';
import Radio from './RadioButton';

export default class RadioGroup extends Component {
    constructor(props) {
        super(props);

        this.state = {selectedValue: "Foo"};

        this.handleChange = this.handleChange.bind(this);

    }

    handleChange(event) {
        this.setState({selectedValue: event.target.value});
    }

    render() {
        return (
            <div>
                <Radio group="fooBar" id="foo" value="Foo" label="Foo" handleChange={this.handleChange} checked={this.state.selectedValue === 'Foo'} />
                <Radio group="fooBar" id="bar" value="Bar" label="Bar" handleChange={this.handleChange} checked={this.state.selectedValue === 'Bar'} />
            </div>
        )
    }
}