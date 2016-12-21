import Home from '../pages/Home';
import Dataset from '../pages/dataset';

export default [
    { path: '/', component: Home },
    ...Dataset.routes
]