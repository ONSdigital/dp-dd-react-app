import { Request } from '../../common/utils';
const request = new Request();

import api from '../../config/api';

import { parseDimensions as persistDimensions } from '../dimensions/actions';
import { updateOption, toggleSelectedOptions } from './utils/updating';
import { parseDimension, parseGeographyDimension } from './utils/parsing';

export const SAVE_DIMENSION_OPTIONS = 'SAVE_DIMENSION_OPTIONS';
export const SELECT_DIMENSION = 'SELECT_DIMENSION';
export const DESELECT_DIMENSION = 'DESELECT_DIMENSION';
export const REQUEST_HIERARCHICAL = 'REQUEST_HIERARCHICAL';
export const REQUEST_HIERARCHICAL_SUCCESS = 'REQUEST_HIERARCHICAL_SUCCESS';
export const DESELECT_ALL_OPTIONS = 'DESELECT_ALL_OPTIONS';
export const SELECT_ALL_OPTIONS = 'SELECT_ALL_OPTIONS';
export const UPDATE_DIMENSION = 'UPDATE_DIMENSION';

export function selectDimension(dimensionID) {
    return (dispatch, getState) => {
        const state = getState();
        const dimension = Object.assign({}, state.dimensions.find(dimension => dimension.id === dimensionID));

        dispatch({
            type: SELECT_DIMENSION,
            dimension
        });
    }
}

export function deselectDimension(dimensionID) {
    return {
        type: DESELECT_DIMENSION,
        dimensionID
    };
}

export function requestHierarchical(datasetID, edition, version, dimensionID) {
    return (dispatch) => {
        dispatch({
            type: REQUEST_HIERARCHICAL,
            id: datasetID
        });

        return request
            .get(api.getDimensionHierarchyURL(datasetID, edition, version, dimensionID))
            .then(function (data) {
                data.hierarchyReady = true;
                dispatch(requestHierarchicalSuccess(datasetID, data));
                dispatch(updateDimension(data));
            }).catch(function (err) {
                throw(err);
            });
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

export function deselectAllOptions(dimensionID, autoDeselected = false) {
    return (dispatch, getState) => {
        const state = getState();
        const dimension = Object.assign({}, state.dimension);

        dispatch({
            type: DESELECT_ALL_OPTIONS,
            dimensionID,
            autoDeselected
        });

        dimension.options = toggleSelectedOptions({ options: dimension.options, selected: false});
        dispatch(updateDimension(dimension));
    }
}

export function selectAllOptions(dimensionID, resetAutoDeselected = false) {
    return (dispatch, getState) => {
        const state = getState();
        const dimension = Object.assign({}, state.dimension);

        dispatch({
            type: SELECT_ALL_OPTIONS,
            dimensionID,
            resetAutoDeselected
        });

        dimension.options = toggleSelectedOptions({ options: dimension.options, selected: true})
        dispatch(updateDimension(dimension));
    }
}

export function saveDimensionOptions({dimensionID, options}) {
    return (dispatch, getState) => {
        const state = getState();
        const selectedDimension = Object.assign({}, state.dimension);

        if (!options) {
            options = state.dimension.options;
        }

        dispatch({ type: SAVE_DIMENSION_OPTIONS, options });

        options.forEach(option => {
            updateOption({
                id: option.id,
                options: selectedDimension.options,
                update: { selected: option.selected  }
            })
        });

        // executes synchronously parsing and replacing dimension state
        dispatch(updateDimension(selectedDimension));

        const dimensions = state.dimensions.map((dimension) => {
            if (dimension.id !== dimensionID) {
                return Object.assign({}, dimension);
            }
            return state.dimension;
        });

        dispatch(persistDimensions(dimensions));
    }
}

export function updateDimension(dimension) {
    if (dimension.type === "geography") {
        dimension = parseGeographyDimension(dimension);
    } else {
        dimension = parseDimension(dimension);
    }

    return {
        type: UPDATE_DIMENSION,
        dimension
    }
}