import action from './actions';

const defaultState = {
    id: null,
    title: null,
    info: null,
    selectors: {}
};

export default function (state = defaultState, action) {
    console.log('---\n', action.type, '\n', action, state);

    switch (action.type) {
        case action.REQUEST_METADATA:

        case action.REQUEST_METADATA_INIT:

            break;
        case action.RECEIVE_METADATA:

            break;
    }
    return state;
}