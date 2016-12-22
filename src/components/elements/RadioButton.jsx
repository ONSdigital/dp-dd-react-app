import React, {Component, PropTypes} from 'react';

const propTypes = {
    id: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    group: PropTypes.string.isRequired,
    handleChange: PropTypes.func.isRequired
}

export default class RadioButton extends Component {
    constructor(props) {
        super(props);

        this.state = {
            focused: false
        };

        this.handleFocus = this.handleFocus.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
    }

    handleFocus() {
        this.setState({focused: true});
    }

    handleBlur() {
        this.setState({focused: false});
    }

    render() {
        return (
            <div className="radio inline">
                <input className="radio__input" type="radio" name={this.props.group} value={this.props.value} id={this.props.id} onFocus={this.handleFocus} onBlur={this.handleBlur} onChange={this.props.handleChange} />
                <label className={"radio__label" + (this.state.focused ? " focused" : "")} htmlFor={this.props.id}>{this.props.label}</label>
            </div>
        )
    }
}

RadioButton.propTypes = propTypes;