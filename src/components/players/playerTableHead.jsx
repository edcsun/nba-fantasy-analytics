import React, { Component } from "react";

class PlayerTableHead extends Component {
  render() {
    const {
      statsSample,
      countPlayers,
      multipliers,
      sortDir,
      sortBy
    } = this.props;
    const statsHeaders = Object.keys(statsSample || {}).map(h => ({
      text: h,
      multiplier: (multipliers.find(m => m.key === h) || {}).value
    }));
    return (
      <thead>
        <tr>
          <th scope="col" className="align-text-top">
            Name
            <span className="badge badge-pill badge-secondary">
              {countPlayers}
            </span>
          </th>
          <th scope="col" className="align-text-top">
            <span
              className="pointer"
              role="img"
              aria-label="add"
              data-toggle="modal"
              data-target="#editPlayerModal"
              onClick={() => this.props.onAdd()}
            >
              ✋🏻
            </span>
          </th>
          <th scope="col" className="align-text-top">
            score{" "}
            <span
              className="pointer"
              role="img"
              aria-label="sort asc"
              onClick={() => this.props.onSort("asc", "score")}
            >
              {sortDir === "asc" && sortBy === "score" ? "🔺" : "🔼"}
            </span>
            <span
              className="pointer"
              role="img"
              aria-label="sort desc"
              onClick={() => this.props.onSort("desc", "score")}
            >
              {sortDir === "desc" && sortBy === "score" ? "🔻" : "🔽"}
            </span>
          </th>
          {statsHeaders.map((h, i) => (
            <th key={i} scope="col" className="align-text-top">
              {h.text}
              <span className="badge badge-pill badge-primary">
                *{h.multiplier}
              </span>

              <span
                className="pointer"
                role="img"
                aria-label="sort asc"
                onClick={() => this.props.onSort("asc", h.text)}
              >
                {sortDir === "asc" && sortBy === h.text ? "🔺" : "🔼"}
              </span>
              <span
                className="pointer"
                role="img"
                aria-label="sort desc"
                onClick={() => this.props.onSort("desc", h.text)}
              >
                {sortDir === "desc" && sortBy === h.text ? "🔻" : "🔽"}
              </span>
            </th>
          ))}
          <th className="align-text-top">remarks</th>
        </tr>
      </thead>
    );
  }
}

export default PlayerTableHead;
