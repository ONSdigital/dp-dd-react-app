import { Request } from '../../common/utils';
const request = new Request();

import api from '../../config/api';

import { toggleSelectedOptions } from '../dimension/utils/updating';
import { parseDimension } from './utils';

export const REQUEST_DIMENSIONS = 'REQUEST_DIMENSIONS';
export const REQUEST_DIMENSIONS_SUCCESS = 'REQUEST_DIMENSIONS_SUCCESS';
export const PARSE_DIMENSIONS = 'PARSE_DIMENSIONS';
export const RESET_DIMENSIONS = 'RESET_DIMENSIONS';

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
                dispatch(parseDimensions(json));
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

export function resetDimension(dimensionId) {
    return (dispatch, getState) => {
        const state = getState();
        const dimension = state.dimensions.find(dimension => {
            return dimension.id === dimensionId;
        });

        delete dimension.autoDeselected;
        dimension.options = toggleSelectedOptions({ options: dimension.options, selected: true})

        if (dimension) {
            dispatch({
                type: RESET_DIMENSIONS,
                dimensionId,
                dimension
            });

            dispatch(parseDimensions(dimension));
        }
    }
}

export function parseDimensions(dimensionsJSON) {
    if (!(dimensionsJSON instanceof Array)) {
        dimensionsJSON = [dimensionsJSON]
    }

    return {
        type: PARSE_DIMENSIONS,
        dimensions: dimensionsJSON.map(dimension => {
            return parseDimension(dimension);
        })
    }
}