import React, {Component, PropTypes} from 'react'

const propTypes = {
    foo: PropTypes.string
};

const defaultProps = {
    foo: "stateFoo"
};

const defaultState = {
  foo: "stateBar"
};

export default class CustomComponent extends Component {
    constructor(props) {
        super(props);
        this.state = defaultState;
    }

    render() {
        return (
            <div>
                <div>{this.props.foo}</div>
                <div>{this.state.foo}</div>
                <hr />
            </div>
        )
    }
}

CustomComponent.propTypes = propTypes;
CustomComponent.defaultProps = defaultProps;