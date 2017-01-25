import config from '../../config';

import Details from './components/Details';
import Download from './components/Download';
import Dimension from './components/Dimension';

export default [
    { path: `${config.BASE_PATH}/datasets/:id`, component: Details },
    { path: `${config.BASE_PATH}/datasets/:id/download`, component: Download },
    { path: `${config.BASE_PATH}/datasets/:id/dimensions`, component: Dimension },
    { path: `${config.BASE_PATH}/datasets/:id/dimensions/:dimensionID`, component: Dimension }
]
