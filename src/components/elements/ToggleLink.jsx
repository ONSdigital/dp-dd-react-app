import React, { Component, PropTypes } from 'react';

const propTypes = {
    label: PropTypes.string.isRequired,
    enabled: PropTypes.bool,
    onClick: PropTypes.func,
}

const defaultProps = {
    enabled: true,
    handleOnClick: ({enabled = true}) => { enabled }
}

export default class ToggleSelectAll extends Component {
    constructor(props) {
        super(props);
        this.handleOnClick = this.handleOnClick.bind(this);
    }

    handleOnClick() {
        const onClick = this.props.onClick;
        if (onClick) {
            onClick({ enabled: this.props.enabled })
        }
    }

    render() {
        if (this.props.enabled) {
            return (
                <a className="margin-right font-size--16"
                   onClick={this.handleOnClick}>{this.props.label}</a>
            )
        }

        return <span className="margin-right font-size--16">{this.props.label}</span>
    }
}

ToggleSelectAll.propTypes = propTypes;
ToggleSelectAll.defaultProps = defaultProps;