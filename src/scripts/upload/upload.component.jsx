// dependencies -------------------------------------------------------

import React       from 'react';
import Reflux      from 'reflux';
import pluralize   from 'pluralize';
import Alert       from './upload.alert.jsx';
import FileSelect  from './upload.file-select.jsx';
import FileTree    from './upload.file-tree.jsx';
import ErrorLink   from './upload.error-link.jsx';
import Progress    from './upload.progress.jsx';
import Results     from './upload.validation-results.jsx';
import Actions     from './upload.actions.js';
import UploadStore from './upload.store.js';
import Messages    from './upload.messages.jsx';
import {PanelGroup, Accordion, Panel} from 'react-bootstrap';


let Upload = React.createClass({

	mixins: [Reflux.connect(UploadStore)],

// life cycle events --------------------------------------------------

	render () {

		// short references
		let self = this;
		let tree = this.state.tree;
		let errors = this.state.errors;
		let warnings = this.state.warnings;
		let dirName = this.state.dirName;

		// validations errors and warning wraps
		let validationMessages;
		if (tree.length > 0 && errors !== 'Invalid') {
			validationMessages = <Results errors={errors} warnings={warnings} />
		}

		let uploadFileStructure;
		if (tree.length > 0) {
			uploadFileStructure = (
				<span>
					{errors !== 'Invalid' ? <ErrorLink dirName={dirName} errors={errors} warnings={warnings} /> : null}
					<Accordion className="fileStructure fadeIn">
						<Panel header="View File Structure" eventKey='1'>
					  		<FileTree tree={tree}/>
					  	</Panel>
				  	</Accordion>
				 </span>
			);
		}

		// select, upload & continue btns
		let buttons;
		if (tree.length > 0 && errors.length === 0 && warnings.length > 0) {
			buttons = (
				<div className="warning-btn-group clearfix">
					<FileSelect onChange={self._onChange} />
					<div className="validate-buttons">
						<button onClick={this._upload.bind(this, null)} className="continueWarning btn-blue">Continue</button>
					</div>
				</div>
			);
		} else {
			buttons = <FileSelect onChange={self._onChange} />;
		}

		let dirHeader;
		if (tree.length > 0) {
			dirHeader = (
				<h3 className="dir-name">
					<i className="folderIcon fa fa-folder-open" /> 
					{dirName}
				</h3>
			);
		}

		let uploadAccordion = (
			<PanelGroup className="upload-accordion" defaultActiveKey='1' accordion>
				<Panel className="upload-panel" header='Upload Dataset' eventKey='1'>
					<div>
						<div className="upload-wrap">
							{buttons}
							{dirHeader}
							<Messages errors={errors} warnings={warnings} uploading={this.state.uploading}/>
						</div>
						{validationMessages}
						{uploadFileStructure}
					</div>
				</Panel>
			</PanelGroup>
		);

		return (
			<div className={this.state.uploading ? 'right-sidebar uploading' : 'right-sidebar'}>
				<div className="upload-nav">
					<h2>My Tasks</h2>
				</div>
				{this.state.alert     ? <Alert onClose={this._closeAlert} /> : null}
				{this.state.uploading ? <Progress progress={this.state.progress} header={dirHeader} /> : uploadAccordion}
			</div>
    	);
	},

// custom methods -----------------------------------------------------

	_onChange: Actions.onChange,

	_upload (selectedFiles) {
		let fileTree = selectedFiles ? selectedFiles.tree : this.state.tree;
		Actions.upload(fileTree);
	},

	_closeAlert: Actions.closeAlert

});


export default Upload;