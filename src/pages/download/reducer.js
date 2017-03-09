import {
    SAVE_DOWNLOAD_OPTIONS,
    SAVE_DOWNLOAD_PROGRESS,
    CANCEL_DOWNLOAD,
} from './actions';

const defaultState = {
    id: '',
    inProgress: false,
    completed: false,
    files: []
}

export default function (state = defaultState, action) {
    switch (action.type) {

        case SAVE_DOWNLOAD_PROGRESS:
            if (!state.inProgress) return state;
            return Object.assign({}, state, {
                id: action.download.id,
                inProgress: action.download.status === 'Pending',
                completed: action.download.status === 'Complete',
                files: action.download.files
            });

        case SAVE_DOWNLOAD_OPTIONS:
            return Object.assign({}, defaultState, {
                inProgress: true
            });

        case CANCEL_DOWNLOAD:
            return Object.assign({}, defaultState);
    }

    return state;
}
