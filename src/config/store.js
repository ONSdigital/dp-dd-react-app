import { createStore, applyMiddleware, compose } from 'redux';
import reducers from './reducers';
import middleware from './middleware';

const internal = {
    store: null
};

export function initStore(initialState) {
    internal.store = createStore(reducers, initialState, applyMiddleware(...middleware));
    return internal.store
}