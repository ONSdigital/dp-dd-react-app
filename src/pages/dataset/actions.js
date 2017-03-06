import { Request } from '../../common/utils';
const request = new Request();

import api from '../../config/api';

export const REQUEST_DATASET_METADATA = 'REQUEST_DATASET_METADATA';
export const REQUEST_DATASET_METADATA_SUCCESS = 'REQUEST_DATASET_METADATA_SUCCESS';
export const REQUEST_DATASET_METADATA_FAILURE = 'REQUEST_DATASET_METADATA_FAILURE';

export const REQUEST_VERSION_METADATA = 'REQUEST_VERSION_METADATA';
export const REQUEST_VERSION_METADATA_SUCCESS = 'REQUEST_VERSION_METADATA_SUCCESS';
export const REQUEST_VERSION_METADATA_FAILURE = 'REQUEST_VERSION_METADATA_FAILURE';

export const SAVE_DOWNLOAD_OPTIONS = 'SAVE_DOWNLOAD_OPTIONS';
export const SAVE_DOWNLOAD_PROGRESS = 'SAVE_DOWNLOAD_PROGRESS';
export const SAVE_DOWNLOAD_OPTIONS_SUCCESS = 'SAVE_DOWNLOAD_OPTIONS_SUCCESS';
export const CANCEL_DOWNLOAD = 'CANCEL_DOWNLOAD';

export function cancelDownload() {
    return {
        type: CANCEL_DOWNLOAD
    }
}

export function saveDownloadOptions(options) {

    return (dispatch, getState) => {
        const state = getState();

        dispatch({
            type: SAVE_DOWNLOAD_OPTIONS,
            options
        });

        const dimensions = state.dataset.dimensions.map(dimension => {
            return {
                id: dimension.id,
                options: flattenSelectedOptions(dimension.options)
            }
        }).filter(dimension => {
            return dimension.options.length > 0;
        });

        const body = JSON.stringify({
            id: state.dataset.versionID,
            fileFormats: options,
            dimensions
        });

        return request
            .post(api.getJobCreatorURL(), { body })
            .then(json => {
                dispatch(requestDownloadProgress(json.id));
            }).catch(err => {
                throw(err);
            });
    }

    function flattenSelectedOptions(options) {
        const list = [];
        if (!options) {
            return list;
        }
        options.forEach(option => {
            if (option.selected) {
                list.push(option.code);
            }
            if (option.options && option.options.length > 0) {
                Array.prototype.push.apply(list, flattenSelectedOptions(option.options));
            }
        })
        return list;
    }
}

export function requestDownloadProgress(jobID) {
    return dispatch => request
        .get(api.getJobStatusURL(jobID))
        .then(json => {
            dispatch(saveDownloadProgress(json));
        })
}

function saveDownloadProgress(json) {
    return {
        type: SAVE_DOWNLOAD_PROGRESS,
        download: json
    }
}

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