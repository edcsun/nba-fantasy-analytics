import React, { Component } from "react";

class ModeSelector extends Component {
  render() {
    const { mode } = this.props;
    return (
      <div className="btn-group btn-group-toggle" data-toggle="buttons">
        <label
          className={"btn btn-secondary " + (mode === "table" ? "active" : "")}
        >
          <input
            type="radio"
            name="options"
            onClick={() => this.props.onChooseMode("table")}
          />
          Table
        </label>
        <label
          className={"btn btn-secondary " + (mode === "pills" ? "active" : "")}
        >
          <input
            type="radio"
            name="options"
            onClick={() => this.props.onChooseMode("pills")}
          />
          Pills
        </label>
      </div>
    );
  }
}

export default ModeSelector;
