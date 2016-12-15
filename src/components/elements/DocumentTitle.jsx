import React, { Component, PropTypes } from 'react';
import withSideEffect from 'react-side-effect';

const propTypes = {
    title: PropTypes.string
}

class DocumentTitle extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        if (this.props.children) {
            return React.Children.only(this.props.children);
        } else {
            return null;
        }
    }
}

DocumentTitle.propTypes = propTypes;

function reducePropsToState(propsList) {
    var innermostProps = propsList[propsList.length - 1];
    if (innermostProps) {
        return innermostProps.title;
    }
}

function handleStateChangeOnClient(title) {
    var nextTitle = title || '';
    nextTitle += ' - Office for National Statistics';

    if (nextTitle !== document.title) {
        document.title = nextTitle;
    }
}

export default withSideEffect(
    reducePropsToState,
    handleStateChangeOnClient
)(DocumentTitle);
