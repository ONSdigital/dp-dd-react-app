import Layout from '../components/Layout';

import Dataset from '../components/pages/Dataset';
import Home from '../components/pages/Home';

export default {
    path: '/',
    component: Layout,
    indexRoute: { component:  Home },
    childRoutes: [
        { path: '/home', component: Home },
        { path: '/dataset', component: Dataset },
    ]
}