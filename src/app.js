import React from "react";
import ReactDOM from "react-dom";

import { browserHistory } from 'react-router';
import { initStore } from './config/store';

import App from "./components/App";
import CSS from "./scss/main.scss";

function init() {

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