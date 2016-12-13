import { combineReducers } from 'redux';

import { routerReducer } from 'react-router-redux';
import { datasetReducer } from '../pages/dataset';

const reducers = combineReducers({
    dataset: datasetReducer,
    routing: routerReducer
});

export default reducers;