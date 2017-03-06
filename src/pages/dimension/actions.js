import { Request } from '../../common/utils';
const request = new Request();

import api from '../../config/api';
import { parseDimensions } from '../dimensions/actions';
import { updateOption, toggleSelectedOptions } from '../dimension/utils';

export const SAVE_DIMENSION_OPTIONS = 'SAVE_DIMENSION_OPTIONS';
export const SELECT_DIMENSION = 'SELECT_DIMENSION';
export const DESELECT_DIMENSION = 'DESELECT_DIMENSION';
export const REQUEST_HIERARCHICAL = 'REQUEST_HIERARCHICAL';
export const REQUEST_HIERARCHICAL_SUCCESS = 'REQUEST_HIERARCHICAL_SUCCESS';
export const DESELECT_ALL_OPTIONS = 'DESELECT_ALL_OPTIONS';
export const SELECT_ALL_OPTIONS = 'SELECT_ALL_OPTIONS';

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
            .then(function (json) {
                dispatch(requestHierarchicalSuccess(datasetID, json));
                dispatch(parseDimensions(json));
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
        const dimension = Object.assign({}, state.dimensions.find(dimension => dimension.id === dimensionID));

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
        const dimension = Object.assign({}, state.dimensions.find(dimension => dimension.id === dimensionID));

        dispatch({
            type: SELECT_ALL_OPTIONS,
            dimensionID,
            resetAutoDeselected
        });

        const options = toggleSelectedOptions({ options: dimension.options, selected: true})
        dispatch(saveDimensionOptions({dimensionID, options}))
    }
}

export function saveDimensionOptions({dimensionID, options}) {
    return (dispatch, getState) => {
        const state = getState();
        const dimensions = state.dimensions.map((dimension) => {
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
        dispatch(parseDimensions(dimensions));
    }
}