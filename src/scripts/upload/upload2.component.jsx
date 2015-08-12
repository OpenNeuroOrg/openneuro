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

		let trace = {
			border: '1px solid #CCC'
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
						<div>
							{true ? <div className="upload-wrap" style={trace}>
															<Select />
														</div> : null}
							{this.state.showRename ? <div className="upload-wrap" style={trace}>
															<Rename />
														</div> : null}
							{this.state.showIssues ? <div className="upload-wrap" style={trace}>
															<Issues />
														</div> : null}
							{this.state.showProgress ? <div className="upload-wrap" style={trace}>
															<Progress progress={this.state.progress} header={dirHeader} /> 
														</div> : null}
							{this.state.showSuccess ? <div className="upload-wrap" style={trace}>
															{this.state.alert     ? <Alert type={this.state.alert} message={this.state.alertMessage} onClose={this._closeAlert} /> : null}
														</div> : null}
						</div>
					</Panel>
				</PanelGroup>
			</div>
    	);
	},

// custom methods -----------------------------------------------------

	_closeAlert: Actions.closeAlert

});


export default Upload;