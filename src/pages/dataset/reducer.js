import {
    REQUEST_METADATA_SUCCESS,
    REQUEST_DIMENSIONS_SUCCESS
} from './actions';

const defaultState = {
    id: null,
    title: null,
    info: null,
    dimensions: []
};

export default function (state = defaultState, action) {
    //console.log('---\n', action.type, '\n', action, state);

    switch (action.type) {
        case REQUEST_DIMENSIONS_SUCCESS:
        case REQUEST_METADATA_SUCCESS:
            state = Object.assign({}, state, action.dataset);
            break;
    }
    return state;
}