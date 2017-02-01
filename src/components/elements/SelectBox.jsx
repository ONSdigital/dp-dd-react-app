import React, { Component, PropTypes } from 'react'

const propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.string,
    hideLabel: PropTypes.bool,
    inline: PropTypes.bool,
    onChange: PropTypes.func.isRequired
}

const defaultProps = {
    hideLabel: false,
    inline: true,
}

export default class SelectBox extends Component {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
    }

    onChange() {
        if (this.props.onChange) {
            this.props.onChange()
        }
    }

    render() {
        const selectOptions = this.props.options;
        return (
            <div className={"select-box" + (this.props.inline ? " select-box--inline" : "")}>
                <label className={"select-box" + (this.props.hideLabel ? " visuallyhidden " : "")} htmlFor={this.props.id}>
                    {this.props.label}
                </label>
                <select id={this.props.id} onChange={this.onChange}
                        className={"select-box__input" + (this.props.inline ? " margin-right--1" : "")}>
                    {
                        selectOptions.map((option, key) => {
                            return <option key={key} value={option.id}>{option.value}</option>
                        })

                    }
                </select>
            </div>
        )
    }

}

SelectBox.propTypes = propTypes;
SelectBox.defaultProps = defaultProps;