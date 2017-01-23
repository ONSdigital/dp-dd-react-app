import React, {Component, PropTypes} from 'react';

const propTypes = {
    id: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    group: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    checked: PropTypes.bool
};

export default class RadioButton extends Component {
    constructor(props) {
        super(props);

        this.state = {
            focused: false,
            checked: props.checked
        };

        this.handleFocus = this.handleFocus.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        const checked = this.state.checked = event.target.checked;
        const id = this.props.id;
        const value = this.props.value;
        const onChange = this.props.onChange;
        if (onChange) {
            onChange({ id, checked, value });
        }
    }

    handleFocus() {
        this.setState({focused: true});
    }

    handleBlur() {
        this.setState({focused: false});
    }

    render() {
        return (
            <div className="radio margin-top--1">
                <input className={"radio__input" + (this.props.checked ? " selected" : "") + (this.state.focused ? " focused" : "")} type="radio" name={this.props.group} checked={this.props.checked}
                       value={this.props.value} id={this.props.id} onFocus={this.handleFocus}
                       onBlur={this.handleBlur} onChange={this.handleChange} />
                <label className="radio__label" htmlFor={this.props.id}>{this.props.label}</label>
            </div>
        )
    }
}

RadioButton.propTypes = propTypes;