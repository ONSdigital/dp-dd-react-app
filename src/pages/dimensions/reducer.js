import {
    PARSE_DIMENSIONS,
} from './actions';

export default function (stateDimensions = [], action) {
    switch (action.type) {
        case PARSE_DIMENSIONS:
            if (action.dimensions.length === 1) {
                return mapDimensions(stateDimensions, action.dimensions[0]);
            }
            return action.dimensions;
    }
    return stateDimensions;
}

function mapDimensions(stateDimensions = [], actionDimension = {}) {
    return stateDimensions.map(dimension => {
        if (dimension.id === actionDimension.id) {
            return Object.assign({}, dimension, actionDimension, {
                hierarchyReady: true
            });
        }
        return dimension;
    });
}