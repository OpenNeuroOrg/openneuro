// dependencies -------------------------------------------------------

import React   from 'react';
import actions from './dataset.actions.js';
import {Modal} from 'react-bootstrap';

export default class Publish extends React.Component {

// life cycle events --------------------------------------------------

    constructor() {
        super();
        this.state = {
            dontShowAgain: false
        };
    }

    render() {
        return (
            <Modal show={this.props.show} onHide={this._hide.bind(this)}>
                <Modal.Header closeButton>
                    <Modal.Title>Warning</Modal.Title>
                </Modal.Header>
                <hr className="modal-inner" />
                <Modal.Body>
                    {this._body(this.props.update)}
                </Modal.Body>
            </Modal>
        );
    }

// template methods ---------------------------------------------------

    _body(currentUpdate) {
        if (currentUpdate) {
            return (
                <div className="row update-modal">
                    <div className="col-xs-12">
                        <div className="modal-text">{currentUpdate.message}</div>
                        {this._dontShowAgain(!currentUpdate.hideDontShow)}<br />
                        <div className="col-xs-12 modal-actions">
                            <button className="btn-modal-submit btn-modal-danger" onClick={this._confirm.bind(this, currentUpdate.action)}>{currentUpdate.confirmTxt ? currentUpdate.confirmTxt : 'Confirm'}</button>
                            <button className="btn-reset" onClick={this._hide.bind(this)}>Cancel</button>
                        </div>
                    </div>
                </div>
            );
        }
    }

    _dontShowAgain(display) {
        if (display) {
            return (
                <div className="parameters form-horizontal">
                    <div className="form-group">
                        <label className="sr-only">Do not show this message again</label>
                        <div className="input-group">
                            <div className="clearfix">
                                <span>
                                    <input id="dontShowAgain" name="dontShowAgain" className="form-control checkbox" type="checkbox"  value={this.state.dontShowAgain} onChange={this._onChange.bind(this)} />
                                    <label aria-invalid="true" htmlFor="dontShowAgain" className="checkmark">
                                        <span></span>
                                    </label>
                                    <div className="input-group-addon">Do not show this message again</div>
                                </span>
                            </div>

                        </div>
                    </div>
                </div>
            );
        }
    }


// actions ------------------------------------------------------------

    /**
     * Confirm
     */
    _confirm(action) {
        if (this.state.dontShowAgain) {actions.disableUpdateWarn();}
        action();
        this.setState({dontShowAgain: false});
        this._hide();
    }

    /**
     * Hide
     */
    _hide() {
        this.props.onHide();
    }

    /**
     * On Change
     */
    _onChange() {
        this.setState({dontShowAgain: !this.state.dontShowAgain});
    }

}

Publish.propTypes = {
    show: React.PropTypes.bool,
    update: React.PropTypes.object,
    onHide: React.PropTypes.func
};

