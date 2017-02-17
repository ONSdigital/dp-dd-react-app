import React from "react";
import ReactDOM from "react-dom";

import { browserHistory } from 'react-router';
import ga from 'ga-react-router';
import { initStore } from './config/store';

import App from "./components/App";
import CSS from "./scss/main.scss";

function init() {

    const unlisten = browserHistory.listen(location => {
        ga('send', location.pathname + location.search);
    });

    initStore(browserHistory, {
        // for alpha we will persist state in local storage
    });

    ReactDOM.render(
        React.createElement(App),
        document.getElementById("app")
    );
}

if (window.addEventListener) {
    window.addEventListener('DOMContentLoaded', init);
} else {
    window.attachEvent('onload', init);
}