import dataset from '../pages/dataset'
import Home from '../pages/Home';

export default [
    { path: '/', component: Home },
    { path: 'dd/dataset/:id', component: dataset.Details },
    { path: 'dd/dataset/:id/download', component: dataset.Download },
    { path: 'dd/dataset/:id/customise', component: dataset.Customise }
]