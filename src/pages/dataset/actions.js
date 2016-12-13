import { checkResponseStatus, parseResponseToJSON } from './utils'

export const REQUEST_METADATA = 'REQUEST_METADATA';
export const REQUEST_METADATA_INIT = 'REQUEST_METADATA_INIT';
export const REQUEST_METADATA_SUCCESS = 'REQUEST_METADATA_SUCCESS';
export const REQUEST_METADATA_FAILURE = 'REQUEST_METADATA_FAILURE';

function initRequestMetadata(id) {
    return {
        type: REQUEST_METADATA_INIT,
        id: id
    }
}

function failRequestMetadata(err) {
    return {
        type: REQUEST_METADATA_FAILURE,
        err: err
    }
}

export function requestMetadata(id) {
    const url = `http://localhost:20099/datasets/${id}`;
    const opts = {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    };

    return (dispatch) => {
        dispatch(initRequestMetadata(id));
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