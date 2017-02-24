import { Request } from './utils';
import api from '../../config/api';
import { updateOption, toggleSelectedOptions } from '../dimension/utils';   // todo: move to dimension

export const REQUEST_DATASET_METADATA = 'REQUEST_DATASET_METADATA';
export const REQUEST_DATASET_METADATA_SUCCESS = 'REQUEST_DATASET_METADATA_SUCCESS';
export const REQUEST_DATASET_METADATA_FAILURE = 'REQUEST_DATASET_METADATA_FAILURE';

export const REQUEST_VERSION_METADATA = 'REQUEST_VERSION_METADATA';
export const REQUEST_VERSION_METADATA_SUCCESS = 'REQUEST_VERSION_METADATA_SUCCESS';
export const REQUEST_VERSION_METADATA_FAILURE = 'REQUEST_VERSION_METADATA_FAILURE';

export const REQUEST_DIMENSIONS = 'REQUEST_DIMENSIONS';
export const REQUEST_DIMENSIONS_SUCCESS = 'REQUEST_DIMENSIONS_SUCCESS';

export const REQUEST_HIERARCHICAL = 'REQUEST_HIERARCHICAL';
export const REQUEST_HIERARCHICAL_SUCCESS = 'REQUEST_HIERARCHICAL_SUCCESS';

export const SAVE_DIMENSION_OPTIONS = 'SAVE_DIMENSION_OPTIONS';
export const PARSE_DIMENSIONS = 'PARSE_DIMENSIONS';

export const DESELECT_ALL_OPTIONS = 'DESELECT_ALL_OPTIONS';             // todo: move to dimension
export const SELECT_ALL_OPTIONS = 'SELECT_ALL_OPTIONS';                 // todo: move to dimension

export const SAVE_DOWNLOAD_OPTIONS = 'SAVE_DOWNLOAD_OPTIONS';
export const SAVE_DOWNLOAD_PROGRESS = 'SAVE_DOWNLOAD_PROGRESS';
export const SAVE_DOWNLOAD_OPTIONS_SUCCESS = 'SAVE_DOWNLOAD_OPTIONS_SUCCESS';
export const CANCEL_DOWNLOAD = 'CANCEL_DOWNLOAD';

const request = new Request();

export function cancelDownload() {
    return {
        type: CANCEL_DOWNLOAD
    }
}

export function deselectAllOptions(dimensionID, autoDeselected = false) {
    return (dispatch, getState) => {
        const state = getState();
        const dimension = Object.assign({}, state.dataset.dimensions.find(dimension => dimension.id === dimensionID));

        dispatch({
            type: DESELECT_ALL_OPTIONS,
            dimensionID,
            autoDeselected
        });

        const options = toggleSelectedOptions({ options: dimension.options, selected: false});
        dispatch(saveDimensionOptions({dimensionID, options}));
    }
}

export function selectAllOptions(dimensionID, resetAutoDeselected = false) {
    return (dispatch, getState) => {
        const state = getState();
        const dimension = Object.assign({}, state.dataset.dimensions.find(dimension => dimension.id === dimensionID));

        dispatch({
            type: SELECT_ALL_OPTIONS,
            dimensionID,
            resetAutoDeselected
        });

        const options = toggleSelectedOptions({ options: dimension.options, selected: true})
        dispatch(saveDimensionOptions({dimensionID, options}))
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

export function saveDimensionOptions({dimensionID, options}) {
    return (dispatch, getState) => {
        const state = getState();
        const dimensions = state.dataset.dimensions.map((dimension) => {
            dimension = Object.assign({}, dimension);
            if (dimension.id !== dimensionID) {
                return dimension;
            }

            options.forEach(option => {
                updateOption({
                    id: option.id,
                    options: dimension.options,
                    update: { selected: option.selected  }
                })
            });

            return dimension;
        });

        dispatch({type: SAVE_DIMENSION_OPTIONS, dimensions });
        dispatch(parseDimensions(state.dataset.id, dimensions));
    }
}

export function requestDimensions(datasetID, edition, version) {
    return (dispatch) => {
        dispatch({
            type: REQUEST_DIMENSIONS,
            id: datasetID
        });

        request
            .get(api.getDimensionsURL(datasetID, edition, version))
            .then(function (json) {
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

function parseDimensions(datasetID, dimensionsJSON) {
    let optionsCount;
    let selectedCount;

    if (!(dimensionsJSON instanceof Array)) {
        dimensionsJSON = [dimensionsJSON]
    }

    return {
        type: PARSE_DIMENSIONS,
        dataset: {
            id: datasetID,
            dimensions: dimensionsJSON.map(dimension => {
                optionsCount = 0;
                selectedCount = 0;

                dimension.options = parseOptions(dimension.options);
                dimension.datasetID = datasetID;
                dimension.optionsCount = optionsCount;
                dimension.selectedCount = selectedCount;
                dimension.edited = selectedCount > 0
                return dimension;
            }),
        }
    }

    function parseOptions(options, selectedStatus = true) {
        return options.map(option => {
            optionsCount ++;

            // todo: we should always use code, requires refactoring across whole app
            if (option.code) {
                option.id = option.code;
            } else {
                console.error('Code is missing');
            }

            option.selected = option.selected === false ? false : selectedStatus;
            selectedCount += option.selected ? 1 : 0;
            if (option.options && option.options.length > 0) {
                option.options = parseOptions(option.options, selectedStatus);
            }
            return option;
        });
    }
}

export function requestHierarchical(datasetID, edition, version, dimensionID) {
    return (dispatch) => {
        dispatch({
            type: REQUEST_HIERARCHICAL,
            id: datasetID
        });

        return request
            .get(api.getDimensionHierarchyURL(datasetID, edition, version, dimensionID))
            .then(function (json) {
                dispatch(requestHierarchicalSuccess(datasetID, json));
                dispatch(parseDimensions(datasetID, json));
            }).catch(function (err) {
                throw(err);
            })
    }
}

function requestHierarchicalSuccess(datasetID, responseData) {
    return {
        type: REQUEST_HIERARCHICAL_SUCCESS,
        dataset: {
            datasetID,
            responseData
        }
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