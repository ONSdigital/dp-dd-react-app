import React, { Component } from 'react';
import api from '../../../config/api';
import { connect } from 'react-redux';
import { requestDatasetMetadata } from '../actions';

class DatasetDetailsContainer extends Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        const {dispatch, dataset} = this.props;
        const params = this.props.params;

        if (params.id !== dataset.id) {
            dispatch(requestDatasetMetadata(params.id));
        }
    }

    componentWillReceiveProps(props) {
        const {dataset, router} = props;
        const params = props.params;

        if (params.id !== dataset.id || !dataset.edition || !dataset.version) {
            return null;
        }
        console.log(api);
debugger;
        router.push({
            pathname: api.getDatasetVersionURL()
        });
    }

    render() {
        return null;
    }
}


export default connect(state => ({ dataset: state.dataset }))(DatasetDetailsContainer);