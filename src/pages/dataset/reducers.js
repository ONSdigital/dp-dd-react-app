import {
    REQUEST_METADATA_SUCCESS,
    PARSE_DIMENSIONS,
    SAVE_DOWNLOAD_PROGRESS
} from './actions';

const defaultState = {
    id: null,
    title: null,
    info: null,
    dimensions: [],
    metadata: {},
    download: {
        id: '',
        isInProgress: false,
        isCompleted: false
    },
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

        case PARSE_DIMENSIONS:
            state = Object.assign({}, state, {
                id: action.dataset.id,
                dimensions: action.dataset.dimensions,
                hasDimensions: true
            });
            break;

        case SAVE_DOWNLOAD_PROGRESS:
            state = Object.assign({}, state, {
                download: Object.assign({}, state.download, {
                    id: action.download.id,
                    isInProgress: action.download.isInProgress,
                    isCompleted: action.download.isCompleted === true
                })
            });
            break;
    }
    return state;
}