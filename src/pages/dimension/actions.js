import { Request } from '../../common/utils';
const request = new Request();

import api from '../../config/api';

import {
    parseDimensions as persistDimensions
} from '../dimensions/actions';

import {
    updateOption,
    toggleSelectedOptions,
    parseDimension as parseSingleDimension
} from './utils';

export const SAVE_DIMENSION_OPTIONS = 'SAVE_DIMENSION_OPTIONS';
export const SELECT_DIMENSION = 'SELECT_DIMENSION';
export const DESELECT_DIMENSION = 'DESELECT_DIMENSION';
export const REQUEST_HIERARCHICAL = 'REQUEST_HIERARCHICAL';
export const REQUEST_HIERARCHICAL_SUCCESS = 'REQUEST_HIERARCHICAL_SUCCESS';
export const DESELECT_ALL_OPTIONS = 'DESELECT_ALL_OPTIONS';
export const SELECT_ALL_OPTIONS = 'SELECT_ALL_OPTIONS';
export const PARSE_DIMENSION = 'PARSE_DIMENSION';

export function selectDimension(dimensionID) {
    return (dispatch, getState) => {
        const state = getState();
        const dimension = Object.assign({}, state.dimensions.find(dimension => dimension.id === dimensionID));

        dispatch({
            type: SELECT_DIMENSION,
            dimension
        })
    }
}

export function deselectDimension(dimensionID) {
    return {
        type: DESELECT_DIMENSION,
        dimensionID
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
            .then(function (data) {
                data.hierarchyReady = true;
                dispatch(requestHierarchicalSuccess(datasetID, data));
                dispatch(parseDimension(data));
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
        dispatch(parseDimension(dimension));
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
        dispatch(parseDimension(dimension));
    }
}

export function saveDimensionOptions({dimensionID, options}) {
    return (dispatch, getState) => {
        const state = getState();
        const dimensions = state.dimensions.map((dimension) => {
            if (dimension.id !== dimensionID) {
                return Object.assign({}, dimension);
            }

            const selectedDimension = Object.assign({}, state.dimension);

            options.forEach(option => {
                updateOption({
                    id: option.id,
                    options: selectedDimension.options,
                    update: { selected: option.selected  }
                })
            });

            return parseSingleDimension(dimension);
        });

        dispatch(persistDimensions(dimensions));
    }
}

export function parseDimension(dimension) {
    dimension = parseSingleDimension(dimension);
    return {
        type: PARSE_DIMENSION,
        dimension
    }
}