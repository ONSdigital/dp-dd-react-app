import dataset from '../pages/dataset';
import Home from '../pages/Home';

const { Details, Download, Customise } = dataset;

export default [
    { path: '/', component: Home },
    { path: 'dd/dataset/:id', component: Details },
    { path: 'dd/dataset/:id/download', component: Download },
    { path: 'dd/dataset/:id/customise(/:dimensionID)', component: Customise }
]