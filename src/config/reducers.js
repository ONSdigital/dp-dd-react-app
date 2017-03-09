import { combineReducers } from 'redux';

import { routerReducer } from 'react-router-redux';

import datasetReducer from '../pages/dataset/reducer';
import dimensionsReducer from '../pages/dimensions/reducer';
import dimensionReducer from '../pages/dimension/reducer';
import dowloadReducer from '../pages/download/reducer'

const reducers = combineReducers({
    routing: routerReducer,
    dataset: datasetReducer,
    dimensions: dimensionsReducer,
    dimension: dimensionReducer,
    download: dowloadReducer
});

export default reducers;