import { Request } from '../../common/utils';
const request = new Request();

import api from '../../config/api';

export const REQUEST_DATASET_METADATA = 'REQUEST_DATASET_METADATA';
export const REQUEST_DATASET_METADATA_SUCCESS = 'REQUEST_DATASET_METADATA_SUCCESS';
export const REQUEST_DATASET_METADATA_FAILURE = 'REQUEST_DATASET_METADATA_FAILURE';

export const REQUEST_VERSION_METADATA = 'REQUEST_VERSION_METADATA';
export const REQUEST_VERSION_METADATA_SUCCESS = 'REQUEST_VERSION_METADATA_SUCCESS';
export const REQUEST_VERSION_METADATA_FAILURE = 'REQUEST_VERSION_METADATA_FAILURE';

export function requestDatasetMetadata(datasetID) {
    return dispatch => {
        dispatch({
            type: REQUEST_DATASET_METADATA,
            id: datasetID
        })

        return request
            .get(api.getDatasetURL(datasetID))
            .then(function (json) {
                dispatch(parseDatasetMetadata(json));
            }).catch(function (err) {
                throw(err);
            })
    }
}

export function parseDatasetMetadata(json) {
    return {
        type: REQUEST_DATASET_METADATA_SUCCESS,
        dataset: json
    }
}

export function requestVersionMetadata(datasetID, edition, version) {

    return dispatch => {
        dispatch({
            type: REQUEST_VERSION_METADATA,
            id: datasetID
        })

        return request
            .get(api.getDatasetVersionURL(datasetID, edition, version))
            .then(function (json) {
                dispatch(parseVersionMetadata(json));
            }).catch(function (err) {
                throw(err);
            })
    }
}

export function parseVersionMetadata(json) {
    return {
        type: REQUEST_VERSION_METADATA_SUCCESS,
        dataset: json
    }
}