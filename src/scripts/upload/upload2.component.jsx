// dependencies -------------------------------------------------------

import React       from 'react';
import Reflux      from 'reflux';
import Actions     from './upload.actions.js';
import UploadStore from './upload.store.js';
import {PanelGroup, Accordion, Panel} from 'react-bootstrap';

import Select   from './upload.select.jsx';
import Rename   from './upload.rename.jsx';
import Issues   from './upload.issues.jsx';
import Progress from './upload.progress.jsx';
import Alert    from './upload.alert.jsx';


let Upload = React.createClass({

	mixins: [Reflux.connect(UploadStore)],

// life cycle events --------------------------------------------------

	render () {

		let activeKey = this.state.activeKey;

		let trace = {
		};

		let dirHeader = (
			<span>
				<label><i className="folderIcon fa fa-folder-open" /></label>
				{this.state.dirName}
			</span>
		);

		let uploadStatus = this.state.uploadStatus;
		return (
			<div className='right-sidebar'>
				<div className="upload-nav">
					<h2>My Tasks</h2>
				</div>
				<PanelGroup className="upload-accordion" defaultActiveKey='1' accordion>
					<Panel className="upload-panel" header='Upload Dataset' eventKey='1'>
						<PanelGroup activeKey={activeKey}  onSelect={this.handleSelect} accordion >
							<Panel header="Select" eventKey="1"><div className="upload-wrap">
								<Select />
							</div></Panel>
							{this.state.showRename ? <Panel header="Name" eventKey="2"><div className="upload-wrap">
															<Rename />
														</div></Panel> : null}
							{this.state.showIssues ? <Panel header="Issues" eventKey="3"><div className="upload-wrap">
															<Issues />
														</div></Panel> : null}
							{this.state.showProgress ? <Panel header="Upload" eventKey="4"><div className="upload-wrap">
															<Progress progress={this.state.progress} header={dirHeader} /> 
														</div></Panel> : null}
						</PanelGroup>
					</Panel>
				</PanelGroup>
				{this.state.alert     ? <Alert type={this.state.alert} message={this.state.alertMessage} onClose={this._closeAlert} /> : null}
			</div>
    	);
	},

// custom methods -----------------------------------------------------

	_closeAlert: Actions.closeAlert,

	  handleSelect(activeKey) {
    this.setState({ activeKey });
  },

});


export default Upload;