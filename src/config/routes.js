import Layout from '../components/Layout';

import Details from '../pages/Details';
import Customise from '../pages/Customise';
import Download from '../pages/Download';
import Home from '../pages/Home';

export default {
    path: '/',
    component: Layout,
    indexRoute: { component:  Home },
    childRoutes: [
        { path: 'home/', component: Home },
        { path: 'dataset/:id', component: Details },
        { path: 'dataset/:id/download', component: Download },
        { path: 'dataset/:id/customise', component: Customise }
    ]
}