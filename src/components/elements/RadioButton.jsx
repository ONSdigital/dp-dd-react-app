import React, {Component} from 'react';

export default class RadioButton extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="inline">
                <input type="radio" name={this.props.group} value={this.props.value} id={this.props.id} onChange={this.props.handleChange} />
                <label htmlFor={this.props.id}>{this.props.label}</label>
            </div>
        )
    }
}