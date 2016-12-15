import {
    REQUEST_METADATA_SUCCESS,
    REQUEST_DIMENSIONS_SUCCESS,
    SAVE_DIMENSION_OPTIONS
} from './actions';

const defaultState = {
    id: null,
    title: null,
    info: null,
    dimensions: [],
    hasMetadata: false,
    hasDimensions: false
};

export default function (state = defaultState, action) {
    //console.log('---\n', action.type, '\n', action, state);

    switch (action.type) {

        case REQUEST_METADATA_SUCCESS:
            state = Object.assign({}, state, action.dataset, {
                hasMetadata: true
            });
            break;

        case REQUEST_DIMENSIONS_SUCCESS:
            state = Object.assign({}, state, {
                id: action.dataset.id,
                dimensions: action.dataset.dimensions,
                hasDimensions: true
            });
            break;

        case SAVE_DIMENSION_OPTIONS:
            // todo: use deep merge for merging hierarchies -> https://www.npmjs.com/package/deepmerge
            const dimensions = state.dimensions.map((dimension) => {
                if (dimension.id !== action.selection.dimensionID) {
                    return dimension;
                }
                dimension.options = dimension.options.map((option) => {
                    option.selected = action.selection.options.find((selectionOption) => {
                        return option.id === selectionOption.id
                    }).selected;
                    return option;
                });
                return dimension;
            });
            state = Object.assign({}, state, { dimensions });
            break;
    }
    return state;
}