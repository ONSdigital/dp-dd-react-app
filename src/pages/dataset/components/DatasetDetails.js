import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { requestDatasetMetadata } from '../actions';

const propTypes = {
    metadata: PropTypes.object,
    title: PropTypes.string
}

class DatasetDetails extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        const dispatch = this.props.dispatch;
        const props = this.props;

        if (props.params.id !== props.id) {
            dispatch(requestDatasetMetadata(props.params.id));
        }

    }

    render () {
        return null;
    }
}

DatasetDetails.propTypes = propTypes;

function mapStateToProps(state) {
    console.log(state);
    return state.dataset;
}


export default connect(mapStateToProps)(() => null)