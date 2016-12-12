import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { Router, Route, RouterContext } from 'react-router';

import store from '../config/store';


import routes from '../config/routes';
export default class App extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Provider store={store.getStore()}>
                <Router history={store.getHistory()} routes={routes} />
            </Provider>
        )
    }
}

// import Layout from './Layout';
// import Customise from '../pages/Customise';
// import Details from '../pages/Details';
// import Download from '../pages/Download';
//
// export default class App extends Component {
//
//     constructor(props) {
//         super(props);
//     }
//
//     render() {
//         return (
//             <Provider store={store.getStore()}>
//                 <Router history={store.getHistory()}>
//                     <Route path="/" component={Layout}>
//                         <Route path="dataset/:id" component={Details} />
//                         <Route path="dataset/:id/details" component={Details} />
//                         <Route path="dataset/:id/download" component={Download} />
//                         <Route path="dataset/:id/customise" component={Customise()} />
//                     </Route>
//                 </Router>
//             </Provider>
//         )
//     }
// }