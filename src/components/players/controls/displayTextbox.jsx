import React, { Component } from "react";

class DisplayTextbox extends Component {
  state = {
    mode: "display"
  };
  changeMode = mode => {
    this.setState({ mode: mode });
  };
  handleTextboxKeyDown = e => {
    if (e.key === "Enter") {
      this.props.onSave({
        value: e.target.value,
        callback: this.handleSaveSuccess
      });
    }
  };
  handleSaveSuccess = data => {
    this.setState({ mode: "display" });
  };
  render() {
    const { mode } = this.state;
    const { content, colClass, inputClass, inputStyle } = this.props;
    switch (mode) {
      case "edit":
        return (
          <div className={colClass || "col-xs-2"}>
            <input
              type="text"
              className={`form-control ${inputClass || "form-control-xs"}`}
              defaultValue={content}
              style={inputStyle || {}}
              onBlur={() => this.changeMode("display")}
              onKeyDown={this.handleTextboxKeyDown}
            />
          </div>
        );
      default:
        return (
          <span onDoubleClick={() => this.changeMode("edit")}>{content}</span>
        );
    }
  }
}

export default DisplayTextbox;
