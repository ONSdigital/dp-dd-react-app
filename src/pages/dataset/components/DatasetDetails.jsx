import React, { Component } from 'react';
import { connect } from 'react-redux';
import { requestDatasetMetadata } from '../actions';

class DatasetDetails extends Component {

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

        router.push({
            pathname: `/dd/datasets/${dataset.id}/editions/${dataset.version}/versions/${dataset.edition}`
        });
    }

    render() {
        return null;
    }
}

function mapStateToProps(state) {
    return {
        dataset: state.dataset
    };
}


export default connect(mapStateToProps)(DatasetDetails);