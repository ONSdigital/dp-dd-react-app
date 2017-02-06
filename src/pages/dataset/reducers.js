import {
    REQUEST_METADATA_SUCCESS,
    PARSE_DIMENSIONS,
    SAVE_DOWNLOAD_PROGRESS,
    CANCEL_DOWNLOAD,
    DESELECT_ALL_OPTIONS
} from './actions';

const defaultState = {
    id: null,
    title: null,
    info: null,
    dimensions: [],
    metadata: {},
    download: {
        id: '',
        inProgress: false,
        completed: false,
        cancelled: false
    },
    hasMetadata: false,
    hasDimensions: false
};

export default function (state = defaultState, action) {
    switch (action.type) {

        case REQUEST_METADATA_SUCCESS:
            state = Object.assign({}, state, action.dataset, {
                hasMetadata: true
            });
            break;

        case PARSE_DIMENSIONS:
            state = Object.assign({}, state, {
                id: action.dataset.id,
                dimensions: action.dataset.dimensions.length > 1
                    ? action.dataset.dimensions
                    : state.dimensions.map(dimension => {
                        const actionDimension = action.dataset.dimensions[0];
                        if (dimension.id === actionDimension.id) {
                            // merges parsed hierarchical dimension
                            return Object.assign({}, dimension, actionDimension, {
                                hierarchyReady: true
                            });
                        }
                        return dimension
                }),
                hasDimensions: true
            });

            break;

        case SAVE_DOWNLOAD_PROGRESS:
            if (state.download.cancelled) {
                state = Object.assign({}, state, {
                    download: Object.assign({}, defaultState.download)
                });
            } else {
                state = Object.assign({}, state, {
                    download: Object.assign({}, state.download, action.download, {
                        inProgress: action.download.status === 'Pending',
                        completed: action.download.status === 'Complete'
                    })
                });
            }
            break;

        case CANCEL_DOWNLOAD:
            state = Object.assign({}, state, {
                download: Object.assign({}, defaultState.download, {
                    cancelled: true
                })
            });
            break;

        case DESELECT_ALL_OPTIONS:
            const dimensions = state.dimensions.map(dimension => {
                if (dimension.id !== action.dimensionID) {
                    return dimension;
                }
                dimension.edited = true;
                return dimension;
            })
            state = Object.assign({}, state, { dimensions });
            break;
    }

    return state;
}