import Home from '../pages/Home';
import dataset from '../pages/dataset';

export default [
    { path: '/', component: Home },
    ...dataset.routes
]