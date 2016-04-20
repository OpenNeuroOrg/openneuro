// dependencies -------------------------------------------------------

import React       from 'react';
import Reflux      from 'reflux';
import Actions     from './upload.actions.js';
import UploadStore from './upload.store.js';
import Input       from '../common/forms/input.jsx';
import FileTree    from './upload.file-tree.jsx';
import {Accordion, Panel} from 'react-bootstrap';

let Rename = React.createClass({

    mixins: [Reflux.connect(UploadStore)],

// life cycle events --------------------------------------------------

    render () {
        let dirName   = this.state.dirName,
            nameError = this.state.nameError,
            tree      = this.state.tree,
            resuming  = this.state.resuming,
            renameResumeMessage;

        if (resuming) {
            renameResumeMessage = (
                <span className="message error">You have selected "{this.state.selectedName}" and are trying to resume "{dirName}." Continue if this is correct or <span className="upload-reset-link" onClick={this._cancel}>cancel</span>.</span>
            );
        }

        let input;
        if (this.state.showRenameInput) {
            input = (
                <div>
                    <label className="add-name"><i className="folderIcon fa fa-folder-open" /></label>
                    <Input type="text" placeholder="dataset name" initialValue={dirName} onChange={this._updateDirName} />
                </div>
            );
        }

        return (
            <div>
                {!resuming ? <span className="message fade-in">Rename your dataset (optional)</span> : null}
                <div className="dir-name has-input clearfix fade-in">
                    {nameError ? <span className="message error character-error">{nameError}</span> : null}
                    {renameResumeMessage}
                    {input}
                </div>
                <Accordion className="file-structure fade-in">
                    <Panel header={dirName + ' File Structure'} eventKey='1'>
                        <FileTree tree={tree}/>
                    </Panel>
                </Accordion>
                <button className="btn-blue" disabled={nameError} onClick={this._validate.bind(null, this.state.list)}>Continue</button>
            </div>
        );
    },

// custom methods -----------------------------------------------------

    _updateDirName: function (e) {
        Actions.updateDirName(e.target.value);
    },

    _validate: Actions.validate,

    _cancel: function () {
        Actions.setInitialState();
    }

});


export default Rename;