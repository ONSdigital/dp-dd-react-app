import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import CSS from "./scss/main.scss";

function init() {
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