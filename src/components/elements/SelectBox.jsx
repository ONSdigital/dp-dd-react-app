import React, { Component, PropTypes } from 'react'

export default class SelectBox extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const selectOptions = this.props.options;
        return (
            <div className={"select-box" + (this.props.inline ? " select-box--inline" : "")}>
                <label className={"select-box" + (this.props.hideLabel ? " visuallyhidden " : "")} htmlFor={this.props.id}>
                    {this.props.label}
                </label>
                <select id={this.props.id} className={"select-box__input" + (this.props.inline ? " margin-right--1" : "")}>
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

// SelectBox.propTypes = propTypes;