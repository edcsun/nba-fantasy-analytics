import React, { Component } from "react";

class MultiplicationForm extends Component {
  state = {};

  constructor() {
    super();
    this.state = { firstLoad: true, multiplier: null };
  }

  componentWillReceiveProps(nextProps) {
    const { multipliers } = nextProps;
    const { firstLoad } = this.state;
    if (firstLoad && multipliers.length > 0) {
      this.setState({ multiplier: multipliers[0], firstLoad: false });
    }
  }

  handleStatChange = e => {
    const { multipliers } = this.props;
    this.setState({
      multiplier: multipliers.find(m => m.key === e.target.value)
    });
  };

  handleValueChange = e => {
    const { multiplier } = this.state;
    multiplier.value = e.target.value;
    this.setState({
      multiplier: multiplier
    });
    this.props.onChange(this.state.multiplier);
  };

  render() {
    const { multipliers } = this.props;
    const { multiplier } = this.state;
    return (
      <form>
        <div className="form-row align-items-center">
          <div className="col-auto">
            <select
              className="form-control form-control-sm"
              onChange={this.handleStatChange}
            >
              {multipliers.map((m, i) => (
                <option key={i} selected={multiplier.value === m.key}>
                  {m.key}
                </option>
              ))}
            </select>
          </div>
          <div className="col-auto">
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="value"
              value={(multiplier || {}).value || ""}
              onChange={this.handleValueChange}
            />
          </div>
        </div>
      </form>
    );
  }
}

export default MultiplicationForm;
