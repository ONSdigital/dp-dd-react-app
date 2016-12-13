import { checkResponseStatus, parseResponseToJSON } from './utils'

const REQUEST_METADATA = 'REQUEST_METADATA';
const REQUEST_METADATA_INIT = 'REQUEST_METADATA_INIT';
const REQUEST_METADATA_SUCCESS = 'REQUEST_METADATA_SUCCESS';
const REQUEST_METADATA_FAILURE = 'REQUEST_METADATA_FAILURE';

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
        //mode: 'no-cors',
        mode: 'cors',
        method: 'GET',
        // headers: {
        //     'Access-Control-Allow-Origin':'*',
        //     'Accept': 'application/json',
        //     'Content-Type': 'application/json'
        // }
        headers: new Headers({
            'Access-Control-Allow-Origin':'*',
            'Content-Type': 'application/json'
        })
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
    debugger;
    return {
        type: REQUEST_METADATA_FAILURE,
        dataset: json
    }
}