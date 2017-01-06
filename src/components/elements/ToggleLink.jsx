import React, { Component, PropTypes } from 'react';

const propTypes = {
    label: PropTypes.string.isRequired,
    enabled: PropTypes.bool,
    hideOnDisabled: PropTypes.bool,
    state: PropTypes.bool,
    handleOnClick: PropTypes.func,
}

const defaultProps = {
    enabled: true,
    hideOnDisabled: false,
    state: false,
    handleOnClick: ({state = true}) => { state }
}

export default class ToggleSelectAll extends Component {
    constructor(props) {
        super(props);
        this.handleOnClick = this.handleOnClick.bind(this);
    }

    handleOnClick() {
        this.props.handleOnClick({
            state: this.props.state
        })
    }

    render() {

        if (this.props.enabled) {
            return (
                <a className="btn btn--link margin-right"
                   onClick={this.handleOnClick}>{this.props.label}</a>
            )
        }

        return <span className="margin-right font-size--14">{this.props.label}</span>
    }
}

ToggleSelectAll.propTypes = propTypes;
ToggleSelectAll.defaultProps = defaultProps;