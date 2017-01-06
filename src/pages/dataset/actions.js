import { Request } from './utils';
import config from '../../config/index';

export const REQUEST_METADATA = 'REQUEST_METADATA';
export const REQUEST_METADATA_SUCCESS = 'REQUEST_METADATA_SUCCESS';
export const REQUEST_METADATA_FAILURE = 'REQUEST_METADATA_FAILURE';

export const REQUEST_DIMENSIONS = 'REQUEST_DIMENSIONS';
export const REQUEST_DIMENSIONS_SUCCESS = 'REQUEST_DIMENSIONS_SUCCESS';
export const REQUEST_DIMENSIONS_FAILURE = 'REQUEST_DIMENSIONS_FAILURE';

export const SAVE_DIMENSION_OPTIONS = 'SAVE_DIMENSION_OPTIONS';
export const PARSE_DIMENSIONS = 'PARSE_DIMENSIONS';

export const SAVE_DOWNLOAD_OPTIONS = 'SAVE_DOWNLOAD_OPTIONS';
export const SAVE_DOWNLOAD_PROGRESS = 'SAVE_DOWNLOAD_PROGRESS';
export const SAVE_DOWNLOAD_OPTIONS_SUCCESS = 'SAVE_DOWNLOAD_OPTIONS_SUCCESS';


const API_URL = config.API_URL;
const request = new Request();

export function saveDownloadOptions(options) {
    const url = `${config.JOB_API_URL}/job`;

    return dispatch => {
        dispatch({
            type: SAVE_DOWNLOAD_OPTIONS,
            options: options
        });

        const body = JSON.stringify({fileFormats: options});

        return request.post(url, {body: body}).then(json => {
            dispatch(saveDownloadProgress({
                id: json.id,
                isInProgress: true
            }));
            dispatch(requestDownloadProgress(json.id));
        }).catch(err => {
            throw(err);
        });
    }
}

function requestDownloadProgress(id) {
    const url = `${config.JOB_API_URL}/job/${id}`;

    return dispatch => {
        setTimeout(function() {
            request.get(url).then(json => {
                switch (json.status) {
                    case ('Pending'): {
                        dispatch(requestDownloadProgress(id));
                        break;
                    }
                    case ('Complete'): {
                        dispatch(saveDownloadProgress({
                            isInProgress: false,
                            isCompleted: true
                        }));
                        break;
                    }
                }
            })
        }, 1000)
    }
}

function saveDownloadProgress(json) {
    return {
        type: SAVE_DOWNLOAD_PROGRESS,
        download: json
    }
}

export function saveDimensionOptions({dimensionID, options}) {

    return (dispatch, getState) => {
        const state = getState();

        // todo: use deep merge for merging hierarchies -> https://www.npmjs.com/package/deepmerge
        const dimensions = state.dataset.dimensions.map((dimension) => {
            dimension = Object.assign({}, dimension);
            if (dimension.id !== dimensionID) {
                return dimension;
            }

            dimension.options = dimension.options.map((option) => {
                option.selected = options.find((selectionOption) => {
                    return option.id === selectionOption.id;
                }).selected;
                return Object.assign({}, option);
            });
            return dimension;
        });

        dispatch({type: SAVE_DIMENSION_OPTIONS, dimensions });
        dispatch(parseDimensions(state.dataset.id, dimensions));
    }
}

export function requestDimensions(datasetID) {
    const url = `${API_URL}/datasets/${datasetID}/dimensions`

    return (dispatch) => {
        dispatch({
            type: REQUEST_DIMENSIONS,
            id: datasetID
        });

        request.get(url).then(function (json) {
            dispatch(requestDimensionsSuccess(datasetID, json));
            dispatch(parseDimensions(datasetID, json));
        }).catch(function (err) {
            throw(err);
        })
    }
}

export function requestDimensionsSuccess(datasetId, responseData) {
    return {
        type: REQUEST_DIMENSIONS_SUCCESS,
        dataset: {
            datasetId,
            responseData
        }
    }
}

export function parseDimensions(datasetID, dimensionsJSON) {
    const dimensionTypes = [
        { type: 'SIMPLE_LIST', dimensions: ['D000123', 'D000124', 'D000125'] }
    ];

    return {
        type: PARSE_DIMENSIONS,
        dataset: {
            id: datasetID,
            dimensions: dimensionsJSON.map(dimension => {
                const typeObj = dimensionTypes.find((dimensionType) => {
                    return dimensionType.dimensions.indexOf(dimension.id) > -1;
                });
                dimension.type = typeObj ? typeObj.type : 'UNKNOWN';
                switch(dimension.type) {
                    case 'SIMPLE_LIST':
                        dimension.options = dimension.options.map(option => Object.assign({}, option, {
                            selected: option.selected === false ? false : true
                        }));
                        break;
                    default:
                        dimension.options = dimension.options.map(option => Object.assign({}, option, {
                            selected: option.selected === true
                        }));
                        break;
                }
                dimension.datasetID = datasetID,
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
    const url = `${API_URL}/datasets/${id}`;

    return dispatch => {
        dispatch({
            type: REQUEST_METADATA,
            id: id
        })

        return request.get(url).then(function (json) {
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