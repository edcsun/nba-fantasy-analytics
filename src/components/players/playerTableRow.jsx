import React, { Component } from "react";
import DisplayTextbox from "./controls/displayTextbox";

class PlayerTableRow extends Component {
  state = {
    showOriginalStats: false
  };
  handleShowDetails = () => {
    this.setState({ showOriginalStats: !this.state.showOriginalStats });
  };
  render() {
    const { player, index } = this.props;
    const { stats } = player;
    const { showOriginalStats } = this.state;
    const statsValues = Object.keys(stats || {}).map(k => ({
      key: k,
      value: stats[k].value,
      originalValue: stats[k].originalValue
    }));
    return (
      <React.Fragment>
        <tr>
          <th scope="row">
            <div className="mh-100">
              {index + 1} {player.name}
            </div>
          </th>
          <th>
            <span
              className="pointer"
              role="img"
              aria-label="view details"
              onClick={this.handleShowDetails}
            >
              {showOriginalStats ? "📃" : "📄"}
            </span>
            <span
              className="pointer"
              role="img"
              aria-label="update"
              data-toggle="modal"
              data-target="#editPlayerModal"
              onClick={() => this.props.onUpdate(player)}
            >
              🤞🏻
            </span>
            <span
              className="pointer"
              role="img"
              aria-label="delete"
              onClick={() => this.props.onDelete(player.id)}
            >
              🖕🏻
            </span>
          </th>
          <td>{!player.score ? 0 : Math.round(player.score * 100) / 100}</td>
          {statsValues.map((v, i) => (
            <td key={i}>
              <div>{!v.value ? 0 : Math.round(v.value * 100) / 100}</div>
            </td>
          ))}
          <td>{player.remarks}</td>
        </tr>
        {showOriginalStats ? (
          <tr>
            <th scope="row">
              <div className="text-right font-weight-normal text-success">
                Ori. stats:
              </div>
            </th>
            <th />
            <td />
            {statsValues.map((v, i) => (
              <td key={i}>
                <div className="text-success">
                  <DisplayTextbox
                    key={i}
                    content={Math.round(v.originalValue * 100) / 100}
                    inputStyle={{ maxWidth: "60px" }}
                    onSave={args =>
                      player.id === -1
                        ? this.props.onSaveNewPlayer({
                            player: player,
                            code: v.key,
                            value: args.value,
                            callback: args.callback
                          })
                        : this.props.onSaveStat({
                            value: args.value,
                            id: player.id,
                            code: v.key,
                            callback: args.callback
                          })
                    }
                  />
                </div>
              </td>
            ))}
            <td>
              <div className="text-success text-left">
                <DisplayTextbox
                  content={player.remarks}
                  colClass="col-sm-12 pl-0 pr-0"
                  onSave={args =>
                    this.props.onSaveStat({
                      value: args.value,
                      id: player.id,
                      code: "remarks",
                      callback: args.callback
                    })
                  }
                />
              </div>
            </td>
          </tr>
        ) : (
          <React.Fragment />
        )}
      </React.Fragment>
    );
  }
}

export default PlayerTableRow;
