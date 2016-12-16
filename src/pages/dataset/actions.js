import { checkResponseStatus, parseResponseToJSON } from './utils'

export const REQUEST_METADATA = 'REQUEST_METADATA';
export const REQUEST_METADATA_SUCCESS = 'REQUEST_METADATA_SUCCESS';
export const REQUEST_METADATA_FAILURE = 'REQUEST_METADATA_FAILURE';

export const REQUEST_DIMENSIONS = 'REQUEST_DIMENSIONS';
export const REQUEST_DIMENSIONS_SUCCESS = 'REQUEST_DIMENSIONS_SUCCESS';
export const REQUEST_DIMENSIONS_FAILURE = 'REQUEST_DIMENSIONS_FAILURE';

export const SAVE_DIMENSION_OPTIONS = 'SAVE_DIMENSION_OPTIONS';

const APIURL = 'http://localhost:20099'

export function saveDimensionOptions({dimensionID, options}) {
    return {
        type: SAVE_DIMENSION_OPTIONS,
        selection: { dimensionID, options }
    }
}

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
    const dimensionTypes = [
        { type: 'SIMPLE_LIST', dimensions: ['D000123', 'D000124', 'D000125'] }
    ];

    return {
        type: REQUEST_DIMENSIONS_SUCCESS,
        dataset: {
            id: datasetID,
            dimensions: dimensionsJSON.map(dimension => {
                const typeObj = dimensionTypes.find((dimensionType) => {
                    return dimensionType.dimensions.indexOf(dimension.id) > -1;
                });
                dimension.type = typeObj ? typeObj.type : 'UNKNOWN';
                switch(dimension.type) {
                    case 'SIMPLE_LIST':
                        dimension.options = dimension.options.map(option => Object.assign({}, option, { selected: true }));
                        break;
                    default:
                        dimension.options = dimension.options.map(option => Object.assign({}, option, { selected: false }));
                        break;
                }
                dimension.optionsCount = dimension.options.length; // todo: count recursively for hierarchy
                dimension.selectedCount = dimension.options.reduce((count, option) => {
                    return option.selected ? count + 1 : count
                } , 0);
                return dimension;
            }),
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

    return dispatch => {
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