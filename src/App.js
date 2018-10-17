import React, { Component } from "react";
import NavBar from "./components/navbar";
import PlayerOverview from "./components/playersOverview";

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <NavBar title="Players" status="Online" />
        <PlayerOverview />
        <main className="container" />
      </React.Fragment>
    );
  }
}

export default App;
