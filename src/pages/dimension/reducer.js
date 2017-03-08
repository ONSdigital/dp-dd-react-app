import {
    UPDATE_DIMENSION,
    SELECT_DIMENSION,
    DESELECT_DIMENSION,
    REQUEST_HIERARCHICAL,
    SELECT_ALL_OPTIONS,
    DESELECT_ALL_OPTIONS
} from './actions';

export default function (dimension = null, action) {
    switch (action.type) {

        case SELECT_DIMENSION:
            return action.dimension;

        case DESELECT_DIMENSION:
            return null;

        case REQUEST_HIERARCHICAL:
            dimension.optionList = dimension.options;
            return dimension;

        case DESELECT_ALL_OPTIONS:
            return Object.assign({}, dimension, {
                autoDeselected: action.autoDeselected ? action.autoDeselected : dimension.autoDeselected
            });

        case SELECT_ALL_OPTIONS:
            return Object.assign({}, dimension, {
                autoDeselected: action.resetAutoDeselected ? false : dimension.autoDeselected
            });

        case UPDATE_DIMENSION:
            return Object.assign({}, dimension, action.dimension);
    }

    return dimension;
}