import React, { Component } from "react";

class PlayerPill extends Component {
  render() {
    const { name, stats, score } = this.props.data;
    const statsValues = Object.keys(stats || {}).map(k => ({
      key: k,
      value: stats[k].value
    }));
    return (
      <div>
        <span className="badge badge-pill badge-warning">
          {this.props.rank}
        </span>
        <span className="badge badge-success">{name}</span>
        {statsValues.map((v, i) => (
          <span key={i} className="badge badge-pill badge-info">
            {v.key}: {Math.round(v.value * 10) / 10}
          </span>
        ))}
        <span className="badge badge-danger">
          {Math.round(score * 10) / 10}
        </span>
      </div>
    );
  }
}

export default PlayerPill;
