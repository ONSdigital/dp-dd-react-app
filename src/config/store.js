import { createStore, applyMiddleware, compose } from 'redux';
import { syncHistoryWithStore, routerMiddleware } from 'react-router-redux'

import reducers from './reducers';
import middleware from './middleware';

const internal = {
    store: null,
    history: null
};

export default {
    getStore: () => { return internal.store },
    getHistory: () => { return internal.history }
}

export function initStore(history, initialState) {
    const enhancers = [
        applyMiddleware(routerMiddleware(history)),
        applyMiddleware(...middleware)
    ];

    let composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    internal.store = createStore(reducers, initialState, composeEnhancers(...enhancers));
    internal.history = syncHistoryWithStore(history, internal.store);
    return internal.store;
}