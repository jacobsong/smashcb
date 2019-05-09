import React, { Component } from "react";
import img from "../img/image1.jpeg";

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">
            Welcome to Smash CB, we're currently under construction!
          </h1>
        </header>
        <br />
        <br />
        <br />
        <p className="App-intro">
          Meet dabsack <br />
          <img src={img} />
        </p>
      </div>
    );
  }
}

export default App;
