// dependencies -------------------------------------------------------

import React       from 'react';
import Reflux      from 'reflux';
import Actions     from './upload.actions.js';
import UploadStore from './upload.store.js';
import {PanelGroup, Accordion, Panel} from 'react-bootstrap';

import Select   from './upload.select.jsx';
import Rename   from './upload.rename.jsx';
import Issues   from './upload.issues.jsx';
import Resume   from './upload.resume.jsx';
import Progress from './upload.progress.jsx';
import Alert    from './upload.alert.jsx';


let Upload = React.createClass({

	mixins: [Reflux.connect(UploadStore)],

// life cycle events --------------------------------------------------

	render () {

	// short references ----------------------------

		let activeKey    = this.state.activeKey;
		let uploadStatus = this.state.uploadStatus;
		let dirName      = this.state.dirName;

	// panels --------------------------------------

		let select = (
			<Panel header="Select" eventKey="1">
				<div className="upload-wrap">
					<Select />
				</div>
			</Panel>
		);

		let rename;
		if (this.state.showRename) {
			rename = (
				<Panel header="Name" eventKey="2">
					<div className="upload-wrap">
						<Rename />
					</div>
				</Panel>
			);
		}

		let issues;
		if (this.state.showIssues) {
			issues = (
				<Panel header="Issues" eventKey="3">
					<div className="upload-wrap">
						<Issues />
					</div>
				</Panel>
			);
		}

		let resume;
		if (this.state.showResume) {
			resume = (
				<Panel header="Resume" eventKey="4">
					<div className="upload-wrap">
						<Resume />
					</div>
				</Panel>
			)
		}

		let progress;
		if (this.state.showProgress) {
			progress = (
				<Panel header="Upload" eventKey="5">
					<div className="upload-wrap">
						<Progress progress={this.state.progress} name={dirName} /> 
					</div>
				</Panel>
			);
		}

	// main template -------------------------------

		return (
			<div className='right-sidebar'>
				<div className="upload-nav">
					<h2>My Tasks</h2>
				</div>
				<PanelGroup className="upload-accordion" defaultActiveKey='1' accordion>
					<Panel className="upload-panel" header='Upload Dataset' eventKey='1'>
						<PanelGroup activeKey={activeKey}  onSelect={this.handleSelect} accordion >
							{select}
							{rename}
							{issues}
							{resume}
							{progress}
						</PanelGroup>
					</Panel>
				</PanelGroup>
				{this.state.alert ? <Alert type={this.state.alert} message={this.state.alertMessage} onClose={this._closeAlert} /> : null}
			</div>
    	);
	},

// custom methods -----------------------------------------------------

	_closeAlert: Actions.closeAlert,

	handleSelect: Actions.selectPanel,

});


export default Upload;