// dependencies -------------------------------------------------------

import React       from 'react';
import Reflux      from 'reflux';
import Actions     from './upload.actions.js';
import UploadStore from './upload.store.js';
import {TabbedArea, TabPane, PanelGroup, Accordion, Panel} from 'react-bootstrap';

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
		let disabledTab  = this.state.disabledTab;
		let totalTabs    = this.state.showResume ? 5 : 4;

	// panels --------------------------------------
		let activeBar = "activeTab-" + activeKey;
		if (activeKey === 5 && totalTabs < 5) {activeBar = 'activeTab-4'}
		let activePane = "upload-wrap activePane-" + activeKey;


		let select;
		if (this.state.showSelect) {
			select = (
				<TabPane eventKey={1} tab='1: Select'  className="upload-step" disabled={disabledTab}>
					<div className={activePane}>
						<Select  />
					</div>
				</TabPane>
			);
		}

		let rename;
		if (this.state.showRename) {
			rename = (
				<TabPane eventKey={2} tab='2: Rename'  className="upload-step" disabled={disabledTab}>
					<div className={activePane}>
						<Rename />
					</div>
				</TabPane>
			);
		}

		let issues;
		if (this.state.showIssues) {
			issues = (
				<TabPane eventKey={3} tab='3: Issues'  className="upload-step" disabled={disabledTab}>
					<div className={activePane}>
						<Issues />
					</div>
				</TabPane>
			);
		}

		let resume;
		if (this.state.showResume) {
			resume = (
				<TabPane eventKey={4} tab='4: Resume'  className="upload-step" disabled={disabledTab}>
					<div className={activePane}>
						<Resume />
					</div>
				</TabPane>
			)
		}

		let progress;
		if (this.state.showProgress) {
			progress = (
				<TabPane eventKey={5} tab={totalTabs + ': Progress'}  className="upload-step" >
					<div className={activePane}>
						<Progress progress={this.state.progress} name={dirName} /> 
					</div>
				</TabPane>
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
						<TabbedArea bsStyle="pills" bsSize="xsmall" className="upload-steps clearfix" activeKey={activeKey} animation={false}  onSelect={this.handleSelect}>
							<div className={activeBar}></div>
							{select}
							{rename}
							{issues}
							{resume}
							{progress}
						</TabbedArea>
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