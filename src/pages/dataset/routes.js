import config from '../../config';

import Details from './components/DatasetDetails';
import Version from './components/DatasetVersion';
import Download from './components/Download';
import Dimension from '../dimension/components/Dimension';
import Dimensions from '../dimensions/components/Dimensions';

export default [
    { path: `${config.BASE_PATH}/datasets/:id`, component: Details },
    { path: `${config.BASE_PATH}/datasets/:id/editions/:edition/versions/:version`, component: Version },
    { path: `${config.BASE_PATH}/datasets/:id/download`, component: Download },
    { path: `${config.BASE_PATH}/datasets/:id/dimensions`, component: Dimensions },
    { path: `${config.BASE_PATH}/datasets/:id/dimensions/:dimensionID`, component: Dimension }
]
