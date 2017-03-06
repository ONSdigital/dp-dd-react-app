import { Request } from '../../common/utils';
const request = new Request();

import api from '../../config/api';

export const REQUEST_DIMENSIONS = 'REQUEST_DIMENSIONS';
export const REQUEST_DIMENSIONS_SUCCESS = 'REQUEST_DIMENSIONS_SUCCESS';
export const PARSE_DIMENSIONS = 'PARSE_DIMENSIONS';

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

function parseDimensions(dimensionsJSON) {
    let optionsCount;
    let selectableCount;
    let selectedCount;

    if (!(dimensionsJSON instanceof Array)) {
        dimensionsJSON = [dimensionsJSON]
    }

    return {
        type: PARSE_DIMENSIONS,
        dimensions: dimensionsJSON.map(dimension => {
            optionsCount = 0;
            selectedCount = 0;
            selectableCount = 0;

            dimension.options = parseOptions(dimension.options);
            dimension.optionsCount = optionsCount;
            dimension.selectedCount = selectedCount;
            dimension.selectableCount = selectableCount;
            dimension.edited = selectedCount > 0
            return dimension;
        })
    }

    function parseOptions(options, selectedStatus = true) {
        return options.map(option => {
            optionsCount ++;
            if (!option.empty) {
                selectableCount ++;
            }

            // todo: we should always use code, requires refactoring across whole app
            if (option.code) {
                option.id = option.code;
            } else {
                console.error('Code value is missing');
            }

            if (!option.empty) {
                option.selected = option.selected === false ? false : selectedStatus;
            } else {
                option.selected = false;
            }

            selectedCount += option.selected ? 1 : 0;
            if (option.options && option.options.length > 0) {
                option.options = parseOptions(option.options, selectedStatus);
            }
            return option;
        });
    }
}