import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

const reducers = combineReducers({
    // - routing reducer
    // - custom reducers
    routing: routerReducer
});

export default reducers;