import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";

const runApp = () => {
    ReactDOM.render(
        <App />,
        document.getElementById("app")
    );
};

if (window.addEventListener) {
    window.addEventListener('DOMContentLoaded', runApp);
    console.log('I am in')
} else {
    window.attachEvent('onload', runApp);
}