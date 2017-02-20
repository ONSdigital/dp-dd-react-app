import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { applyRouterMiddleware, Router, Route, RouterContext } from 'react-router';
import { useScroll } from 'react-router-scroll';
import analytics from '../config/analytics';

import store from '../config/store';
import routes from '../config/routes';

const renderWithMiddleware = applyRouterMiddleware(
    useScroll()
);

export default class App extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Provider store={store.getStore()}>
                <Router
                    history={store.getHistory()}
                    routes={routes}
                    render={renderWithMiddleware}
                    onUpdate={analytics.logPageView}
                />
            </Provider>
        )
    }
}