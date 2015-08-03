// dependencies -------------------------------------------------------

import React       from 'react';
import Reflux      from 'reflux';
import pluralize   from 'pluralize';
import DirUpload   from './dirUpload.component.jsx';
import DirTree     from './dirTree.component.jsx';
import ErrorLink   from './errorLink.component.jsx';
import UploadAlert from '../common/partials/alert.component.jsx';
import Progress    from './progress.component.jsx';
import DirValidationMessages from './dirValidationMessages.component.jsx';
import ValidationResults from './validationResults.component.jsx';
import {PanelGroup, Accordion, Panel, Alert} from 'react-bootstrap';
import Actions      from './upload.actions.js';
import UploadStore  from './upload.store.js';

import Messages     from './messages.component.jsx';


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
		if (tree.length > 0) {
			validationMessages = <ValidationResults errors={errors} warnings={warnings} />
		}

		let uploadFileStructure;
		if (tree.length > 0) {
			uploadFileStructure = (
				<span>
					<ErrorLink dirName={dirName} errors={errors} warnings={warnings} />
					<Accordion className="fileStructure fadeIn">
						<Panel header="View File Structure" eventKey='1'>
					  		<DirTree tree={tree}/>
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
					<DirUpload onChange={self._onChange} />
					<div className="validate-buttons">
						<button onClick={this._upload.bind(this, null)} className="continueWarning btn-blue">Continue</button>
					</div>
				</div>
			);
		} else {
			buttons = <DirUpload onChange={self._onChange} />;
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
							<Messages errors={errors} warnings={warnings} tree={tree} uploading={this.state.uploading}/>
						</div>
						{validationMessages}
						{uploadFileStructure}
					</div>
				</Panel>
			</PanelGroup>
		);

		let alert;
		if (this.state.alert) {
			alert = (
				<Alert className="fadeInDown clearfix" bsStyle='success'>
					<div className="alert-left"><strong>Success!</strong> Your Dataset has been added and saved to your Dashboard. </div> <button className="alert-right dismiss-button-x" onClick={this._closeAlert}> <i className="fa fa-times"></i> </button>
				</Alert>
			);
		}

		return (
			<div className={this.state.uploading ? 'right-sidebar uploading' : 'right-sidebar'}>
				<div className="upload-nav">
					<h2>My Tasks</h2>
				</div>
				{alert}
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