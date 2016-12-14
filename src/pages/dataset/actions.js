import { checkResponseStatus, parseResponseToJSON } from './utils'

export const REQUEST_METADATA = 'REQUEST_METADATA';
export const REQUEST_METADATA_SUCCESS = 'REQUEST_METADATA_SUCCESS';
export const REQUEST_METADATA_FAILURE = 'REQUEST_METADATA_FAILURE';

export const REQUEST_DIMENSIONS = 'REQUEST_DIMENSIONS'
export const REQUEST_DIMENSIONS_SUCCESS = 'REQUEST_DIMENSIONS_SUCCESS'
export const REQUEST_DIMENSIONS_FAILURE = 'REQUEST_DIMENSIONS_FAILURE'

const APIURL = 'http://localhost:20099'

export function requestDimensions(id) {
    const url = `${APIURL}/datasets/${id}/dimensions`
    const opts = {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    };

    return (dispatch) => {
        dispatch({
            type: REQUEST_DIMENSIONS,
            id: id
        })
        return fetch(url, opts)
            .then(checkResponseStatus)
            .then(parseResponseToJSON)
            .then(function (json) {
                dispatch(parseDimensions(id, json))
            }).catch(function (err) {
                throw(err);
            })
    }
}

export function parseDimensions(datasetID, dimensionsJSON) {
    return {
        type: REQUEST_DIMENSIONS_SUCCESS,
        dataset: {
            id: datasetID,
            dimensions: dimensionsJSON
        }
    }
}

export function requestMetadata(id) {
    const url = `${APIURL}/datasets/${id}`;
    const opts = {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    };

    return (dispatch) => {
        dispatch({
            type: REQUEST_METADATA,
            id: id
        })
        return fetch(url, opts)
            .then(checkResponseStatus)
            .then(parseResponseToJSON)
            .then(function (json) {
                dispatch(parseMetadata(json));
            }).catch(function (err) {
                throw(err);
            })
    }
}

export function parseMetadata(json) {
    return {
        type: REQUEST_METADATA_SUCCESS,
        dataset: json
    }
}