import Details from './components/Details';
import Download from './components/Download';
import Customise from './components/Customise';
import config from '../../config';

export default [
    { path: `${config.BASE_PATH}/dataset/:id`, component: Details },
    { path: `${config.BASE_PATH}/dataset/:id/download`, component: Download },
    { path: `${config.BASE_PATH}/dataset/:id/customise(/:dimensionID)`, component: Customise }
]
