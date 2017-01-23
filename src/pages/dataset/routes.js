import Details from './components/Details';
import Download from './components/Download';
import Customise from './components/Customise';
import config from '../../config';

export default [
    { path: `${config.BASE_PATH}/datasets/:id`, component: Details },
    { path: `${config.BASE_PATH}/datasets/:id/download`, component: Download },
    { path: `${config.BASE_PATH}/datasets/:id/customise(/:dimensionID)`, component: Customise }
]
