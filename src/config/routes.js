import Home from '../pages/Home';

import config from './';
import Details from '../pages/dataset/containers/DetailsContainer';
import Version from '../pages/dataset/containers/VersionContainer';
import BackgroundNotes from '../pages/backgroundNotes/BackgroundNotesContainer'
import Dimension from '../pages/dimension/components/Dimension';
import Dimensions from '../pages/dimensions/components/Dimensions';
import Download from '../pages/download/container';

export default [
    { path: '/', component: Home },
    { path: `${config.BASE_PATH}/datasets/:id`, component: Details },
    { path: `${config.BASE_PATH}/datasets/:id/editions/:edition/versions/:version`, component: Version },
    { path: `${config.BASE_PATH}/datasets/:id/editions/:edition/versions/:version/background-notes`, component: BackgroundNotes },
    { path: `${config.BASE_PATH}/datasets/:id/editions/:edition/versions/:version/dimensions`, component: Dimensions },
    { path: `${config.BASE_PATH}/datasets/:id/editions/:edition/versions/:version/dimensions/:dimensionID`, component: Dimension },
    { path: `${config.BASE_PATH}/datasets/:id/editions/:edition/versions/:version/download`, component: Download }
]