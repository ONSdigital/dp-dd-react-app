import Home from '../pages/Home';

import config from './';
import Details from '../pages/dataset/components/DatasetDetails';
import Version from '../pages/dataset/components/DatasetVersion';
import Download from '../pages/dataset/components/Download';

import Dimension from '../pages/dimension/components/Dimension';
import Dimensions from '../pages/dimensions/components/Dimensions';

export default [
    { path: '/', component: Home },
    { path: `${config.BASE_PATH}/datasets/:id`, component: Details },
    { path: `${config.BASE_PATH}/datasets/:id/editions/:edition/versions/:version`, component: Version },
    { path: `${config.BASE_PATH}/datasets/:id/editions/:edition/versions/:version/download`, component: Download },
    { path: `${config.BASE_PATH}/datasets/:id/editions/:edition/versions/:version/dimensions`, component: Dimensions },
    { path: `${config.BASE_PATH}/datasets/:id/editions/:edition/versions/:version/dimensions/:dimensionID`, component: Dimension }
]