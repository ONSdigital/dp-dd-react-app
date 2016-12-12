import dataset from '../pages/dataset'
import Home from '../pages/Home';

export default [
    { path: '/', component: Home },
    { path: 'dataset/:id', component: dataset.Details },
    { path: 'dataset/:id/download', component: dataset.Download },
    { path: 'dataset/:id/customise', component: dataset.Customise }
]