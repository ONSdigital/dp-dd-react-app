import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import { initStore } from './config/store';
import CSS from "./scss/main.scss";

function init() {

    initStore({
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