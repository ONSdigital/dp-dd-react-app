import React, { Component, PropTypes } from 'react'

const propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.string,
    hideLabel: PropTypes.bool,
    inline: PropTypes.bool,
    onChange: PropTypes.func
}

const defaultProps = {
    hideLabel: false,
    inline: true,
}

export default class SelectBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.id,
            value: null
        }
        this.onChange = this.onChange.bind(this);
    }

    onChange(evt) {
        const id = this.state.id;
        const value = evt.target.value;
        const onChange = this.props.onChange;
        this.setState({ id, value });
        !onChange || onChange({ id, value });
    }

    render() {
        const selectOptions = this.props.options;
        const selectClass = "select-box__input" + (this.props.inline ? " margin-right--1" : "");
        const labelClass = "select-box" + (this.props.hideLabel ? " visuallyhidden " : "");
        return (
            <div className={"select-box" + (this.props.inline ? " select-box--inline" : "")}>
                <label className={labelClass} htmlFor={this.props.id}>
                    {this.props.label}
                </label>
                <select id={this.props.id} onChange={this.onChange} className={selectClass}>
                    {selectOptions.map((option, key) => <option key={key} value={option.id}>{option.value}</option>)}
                </select>
            </div>
        )
    }
}

SelectBox.propTypes = propTypes;
SelectBox.defaultProps = defaultProps;