import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
import "bootstrap/dist/css/bootstrap.css";
import jquery from "jquery";
import "bootstrap/dist/js/bootstrap.bundle";

window.jQuery = jquery;
ReactDOM.render(<App />, document.getElementById("root"));
registerServiceWorker();
