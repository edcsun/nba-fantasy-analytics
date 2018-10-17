import React, { Component } from "react";
import ModeSelector from "./controls/modeSelector";
import MultiplicationForm from "./controls/multiplicationForm";

class Controls extends Component {
  render() {
    const { mode, multipliers, sortBy } = this.props;
    return (
      <div className="container">
        <ModeSelector mode={mode} onChooseMode={this.props.onChooseMode} />

        <button
          type="button"
          className="btn btn-primary"
          onClick={this.props.onExportCsv}
        >
          Export
        </button>
        <MultiplicationForm
          multipliers={multipliers}
          onChange={this.props.onStatMultiplicationChange}
        />
      </div>
    );
  }
}

export default Controls;
