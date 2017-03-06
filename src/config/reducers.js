import { combineReducers } from 'redux';

import { routerReducer } from 'react-router-redux';
import datasetReducers from '../pages/dataset/reducers';

const reducers = combineReducers({
    dataset: datasetReducers,
    routing: routerReducer
});

export default reducers;