import React, { Component } from "react";

class PlayerModal extends Component {
  handleOnSubmit = e => {
    e.preventDefault();
    const { player } = this.props;
    const playerToSubmit = {
      id: player.id,
      name: e.target.name.value,
      stats: {},
      remarks: e.target.remarks.value
    };
    Object.keys(player.stats || {}).forEach(k => {
      playerToSubmit.stats[k] = e.target[k].value;
    });
    this.props.onSave({
      player: playerToSubmit,
      callback: () => {
        window.jQuery("#editPlayerModal").modal("hide");
      }
    });
  };
  componentWillReceiveProps() {
    window.jQuery("#editPlayerModal form")[0].reset();
  }
  render() {
    let { player } = this.props;
    player = player || {
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
    };
    const { name, remarks, stats } = player || {};
    const statsValues = Object.keys(stats || {}).map(k => ({
      key: k,
      originalValue: stats[k] ? stats[k].originalValue : null
    }));
    return (
      <div
        className="modal fade bd-example-modal-lg"
        tabIndex="-1"
        id="editPlayerModal"
        role="dialog"
        aria-labelledby="Edit Player"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg" role="document">
          <form onSubmit={this.handleOnSubmit}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <div className="form-row">
                    <div className="form-group col-sm-12">
                      <input
                        type="text"
                        name="name"
                        className="form-control"
                        placeholder="name"
                        defaultValue={name}
                      />
                    </div>
                  </div>
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div>
                  <div className="form-row">
                    {statsValues.map((v, i) => (
                      <div key={i} className="form-group col-sm-2">
                        <label>{v.key}</label>
                        <div className="">
                          <input
                            type="text"
                            name={v.key}
                            className="form-control"
                            placeholder={v.key}
                            defaultValue={v.originalValue}
                          />
                        </div>
                      </div>
                    ))}
                    <div className="form-group col-sm-4">
                      <label>remarks</label>
                      <div>
                        <input
                          type="text"
                          name="remarks"
                          className="form-control"
                          placeholder="remarks"
                          defaultValue={remarks}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-dismiss="modal"
                >
                  Close
                </button>
                <button type="submit" className="btn btn-primary">
                  Save
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default PlayerModal;
