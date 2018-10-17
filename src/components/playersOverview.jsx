import React, { Component } from "react";
import Controls from "./players/controls";
import PlayerPill from "./players/playerPill";
import PlayerTableHead from "./players/playerTableHead";
import PlayerTableRow from "./players/playerTableRow";
import PlayerModal from "./players/playerModal";
import fileDownload from "js-file-download";
import "./players.css";

class PlayersOverview extends Component {
  state = {
    mode: null,
    editingPlayer: null,
    players: [],
    multipliers: [],
    sortDir: "",
    sortBy: ""
  };
  componentDidMount() {
    this.loadAllPlayers();
    fetch("/api/multipliers")
      .then(res => res.json())
      .then(
        result => {
          const multipliers = Object.keys(result).map(k => ({
            key: k,
            value: result[k]
          }));
          const { players } = this.state;
          if (players.length > 0) {
            multipliers.forEach(m =>
              this.updatePlayersForMultiplier(m, players)
            );
          }
          this.setState({
            multipliers: multipliers
          });
        },
        error => {
          alert("unable to load multipliers");
        }
      );
  }
  loadAllPlayers = () => {
    fetch("/api/players")
      .then(res => res.json())
      .then(
        result => {
          const players = result.map(r => {
            const p = {
              id: r.id,
              name: r.name,
              score: r.score,
              stats: {},
              remarks: r.remarks
            };
            Object.keys(r.stats).forEach(k => {
              p.stats[k] = { originalValue: r.stats[k], value: r.stats[k] };
            });
            return p;
          });
          const { multipliers } = this.state;
          if (multipliers.length > 0) {
            multipliers.forEach(m =>
              this.updatePlayersForMultiplier(m, players)
            );
          }
          const newState = {
            players: players,
            mode: "table"
          };
          this.setState(newState);
        },
        error => {
          alert("unable to load players");
        }
      );
  };
  handleChooseMode = mode => {
    this.setState({ mode: mode });
  };
  updatePlayersForMultiplier = (multiplier, players) => {
    players.forEach(p => {
      Object.keys(p.stats).forEach(k => {
        if (k === multiplier.key) {
          const stat = p.stats[k];
          stat.value = stat.originalValue * parseFloat(multiplier.value);
        }
      });
      p.score = Object.keys(p.stats)
        .map(k => p.stats[k].value)
        .reduce((total, num) => total + num);
    });
    const { sortDir, sortBy } = this.state;
    this.handleSort(sortDir || "desc", sortBy || "score");
  };
  handleStatMultiplicationChange = multiplier => {
    const { multipliers, players } = this.state;
    this.setState({
      multipliers: multipliers
    });
    this.updatePlayersForMultiplier(multiplier, players);
    const multiplierData = {};
    multipliers.forEach(m => (multiplierData[m.key] = parseFloat(m.value)));
    fetch("/api/multipliers/fullset", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(multiplierData)
    })
      .then(res => {
        console.log("Save mulipliers response:", res);
        if (res.status !== 200)
          alert("Unable to save multiplier. " + res.statusText);
      })
      .then(data => {})
      .catch(function(error) {
        alert("Unable to save multiplier. " + error);
        console.log(error);
      });
  };
  handleSort = (dir, key) => {
    const { players } = this.state;
    players.sort((a, b) => {
      let aValue;
      let bValue;
      switch (key) {
        case "score":
          aValue = a[key];
          bValue = b[key];
          break;
        default:
          aValue = a.stats[key].value;
          bValue = b.stats[key].value;
          break;
      }
      switch (dir) {
        case "asc":
          if (aValue > bValue) return 1;
          if (aValue < bValue) return -1;
          return 0;
        case "desc":
          if (aValue > bValue) return -1;
          if (aValue < bValue) return 1;
          return 0;
        default:
          return 0;
      }
    });
    this.setState({
      players: players,
      sortDir: dir,
      sortBy: key
    });
  };

  handleSaveStat = args => {
    const { value, id, code, callback } = args;
    const data = {};
    data[code] = value;
    fetch(`/api/player/${id}/attr/${code}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
      .then(res => {
        console.log("Save stat response:", res);
        if (res.status !== 200) alert("Unable to save stat. " + res.statusText);
      })
      .then(data => {
        this.reloadPlayer(id);
        if (callback) callback(data);
      })
      .catch(function(error) {
        alert("Unable to save stat. " + error);
        console.log(error);
      });
  };

  handleSaveNewPlayer = args => {
    const { value, player, code, callback } = args;
    switch (code) {
      case ("fg",
      "ft",
      "3pt",
      "pt",
      "rbl",
      "ast",
      "rbl",
      "stl",
      "blk",
      "to",
      "extra"):
        player.stats[code] = value;
        break;
      case ("name", "remarks"):
        player[code] = value;
        break;
      default:
        break;
    }
    player.name = player.name || "temp";
    fetch(`/api/player/add`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(player)
    })
      .then(res => {
        console.log("Add player response:", res);
        if (res.status !== 200)
          alert("Unable to add player. " + res.statusText);
      })
      .then(data => {
        console.log(data);
        this.reloadPlayer(data.id);
        if (callback) callback(data);
      })
      .catch(function(error) {
        alert("Unable to add player. " + error);
        console.log(error);
      });
  };

  reloadPlayer = id => {
    fetch(`/api/players/${id}`)
      .then(res => res.json())
      .then(
        result => {
          console.log("loaded player");
          const p = {
            id: result.id,
            name: result.name,
            score: result.score,
            stats: {},
            remarks: result.remarks
          };
          Object.keys(result.stats).forEach(k => {
            p.stats[k] = {
              originalValue: result.stats[k],
              value: result.stats[k]
            };
          });
          let { players } = this.state;
          if (players.some(p2 => p2.id === p.id)) {
            players = players.map(player => (player.id === p.id ? p : player));
          } else {
            players.push(p);
          }
          const { multipliers } = this.state;
          if (multipliers.length > 0) {
            multipliers.forEach(m =>
              this.updatePlayersForMultiplier(m, players)
            );
          }
          const newState = {
            players: players
          };
          this.setState(newState);
        },
        error => {
          alert("unable to load players");
        }
      );
  };

  handleExportCsv = () => {
    fetch(`/api/players?format=csv&showHeader=true`)
      .then(res => res.text())
      .then(
        result => {
          fileDownload(result, "players.csv");
        },
        error => {
          alert(`unable to load players csv, ${error}`);
        }
      );
  };

  handleAddPlayer = () => {
    this.setState({
      editingPlayer: {
        id: -1,
        name: "",
        stats: {
          fg: null,
          ft: null,
          "3pt": null,
          pt: null,
          rbl: null,
          ast: null,
          stl: null,
          blk: null,
          to: null,
          extra: null
        },
        remarks: ""
      }
    });
  };

  handleToUpdatePlayer = player => {
    this.setState({
      editingPlayer: player
    });
  };

  handlePlayerSave = args => {
    const { player, callback } = args;
    const { id } = player;
    if (id === -1) {
      console.log(`to save new player id: ${id}`);

      fetch(`/api/player/add`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(player)
      })
        .then(response => {
          if (!response.ok) throw new Error(response.statusText);
          return response.json();
        })
        .then(item => {
          console.log(`saved new player succesfully id:${item.id}`, item);
          this.reloadPlayer(item.id);
          if (callback) callback(item);
        })
        .catch(function(error) {
          alert("Unable to add player. " + error);
          console.log(error);
        });
    } else {
      console.log(`to save existing player id: ${id}`);
      fetch(`/api/player/${id}`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(player)
      })
        .then(response => {
          if (!response.ok) throw new Error(response.statusText);
          return response.json();
        })
        .then(item => {
          console.log(`saved player succesfully id:${item.id}`, item);
          this.reloadPlayer(item.id);
          if (callback) callback(item);
        })
        .catch(function(error) {
          alert("Unable to save player. " + error);
          console.log(error);
        });
    }
  };

  handleDeletePlayer = id => {
    if (window.confirm(`Confirm to delete player id:${id}`)) {
      console.log(`to delete player id:${id}`);

      fetch(`/api/player/${id}`, { method: "DELETE" })
        .then(response => {
          if (!response.ok) throw new Error(response.statusText);
          return response.json();
        })
        .then(item => {
          console.log(`deleted player succesfully id:${item.id}`, item);
          this.loadAllPlayers();
        })
        .catch(function(error) {
          alert("Unable to delete player. " + error);
          console.log(error);
        });
    }
  };

  render() {
    const {
      players,
      mode,
      editingPlayer,
      multipliers,
      sortDir,
      sortBy
    } = this.state;
    return (
      <div>
        <Controls
          players={players}
          mode={mode}
          multipliers={multipliers}
          onChooseMode={this.handleChooseMode}
          onStatMultiplicationChange={this.handleStatMultiplicationChange}
          onExportCsv={this.handleExportCsv}
        />
        <div>
          {
            {
              pills: players.map((player, i) => (
                <PlayerPill key={i} data={player} rank={i + 1} />
              )),
              table: (
                <div className="table-responsive-md">
                  <table className="table table-sm">
                    <PlayerTableHead
                      statsSample={players.length > 0 ? players[0].stats : {}}
                      countPlayers={players.length}
                      multipliers={multipliers}
                      sortDir={sortDir}
                      sortBy={sortBy}
                      onSort={this.handleSort}
                      onAdd={this.handleAddPlayer}
                    />
                    <tbody>
                      {players.map((player, i) => (
                        <PlayerTableRow
                          key={i}
                          player={player}
                          index={i}
                          onSaveStat={this.handleSaveStat}
                          onSaveNewPlayer={this.handleSaveNewPlayer}
                          onUpdate={this.handleToUpdatePlayer}
                          onDelete={this.handleDeletePlayer}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            }[mode]
          }
        </div>
        <PlayerModal player={editingPlayer} onSave={this.handlePlayerSave} />
      </div>
    );
  }
}

export default PlayersOverview;
