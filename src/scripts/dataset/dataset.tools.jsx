// dependencies -------------------------------------------------------

import React        from 'react';
import Reflux       from 'reflux';
import datasetStore from './dataset.store';
import actions      from './dataset.actions.js';
import userStore    from '../user/user.store.js';
import WarnButton   from '../common/forms/warn-button.jsx';
import Share        from './dataset.tools.share.jsx';
import Jobs         from './dataset.tools.jobs.jsx';
import moment       from 'moment';
import crn          from '../utils/crn';

let Tools = React.createClass({

    mixins: [Reflux.connect(datasetStore)],

// life cycle events --------------------------------------------------

	componentDidMount() {
		let dataset = this.state.dataset;
		if (dataset && (dataset.access === 'rw' || dataset.access == 'admin')) {
			actions.loadUsers();
		}
	},

	render() {
		let dataset   = this.state.dataset;
		let users     = this.state.users;
		let snapshots = this.state.snapshots;

		// permission check shorthands
		let isAdmin      = dataset.access === 'admin';
		let isEditor     = dataset.access === 'rw';
		let isViewer     = dataset.access === 'ro';
		let isSignedIn   = !!userStore.hasToken();
		let isPublic     = !!dataset.public;
		let isIncomplete = !!dataset.status.uploadIncomplete;
		let isSnapshot   = !!dataset.original;
		let isSuperuser  = window.localStorage.scitranUser ? JSON.parse(window.localStorage.scitranUser).root : null;


		let tools = [
			{
				tooltip: 'Download Dataset',
				icon: 'fa-download',
				prepDownload: actions.getDatasetDownloadTicket.bind(this, this.state.snapshot),
				action: actions.trackDownload,
				display: true
			},
			{
				tooltip: 'Make Dataset Public',
				icon: 'fa-globe',
				action: actions.publish.bind(this, dataset._id, true),
				display: isAdmin && !isPublic && !isIncomplete,
				validations: [
					{
						check: !isSnapshot,
						message: 'You can only publish dataset snapshots not originals.'
					}
				],
				warn: true
			},
			{
				tooltip: 'Unpublish Dataset',
				icon: 'fa-eye-slash',
				action: actions.publish.bind(this, dataset._id, false),
				display: isPublic && isSuperuser,
				warn: true
			},
			{
				tooltip: 'Delete Dataset',
				icon: 'fa-trash',
				action: actions.deleteDataset.bind(this, dataset._id),
				display: isAdmin && !isPublic,
				warn: true
			},
			{
				tooltip: 'Share Dataset',
				icon: 'fa-user-plus',
				action: actions.toggleModal.bind(null, 'Share'),
				display: isAdmin && !isSnapshot,
				warn: false
			},
			{
				tooltip: 'Create Snapshot',
				icon: 'fa-camera-retro',
				action: actions.createSnapshot,
				display: isAdmin && !isSnapshot && !isIncomplete,
				warn: true,
				validations: [
					{
						check: !dataset.authors || !(dataset.authors.length > 0),
						message: 'You must list at least one author before creating a snapshot.'
					}
				],
			}
		];


		let runAnalysis;
		if (isSignedIn && !isIncomplete) {
			runAnalysis = (
				<div className="run-analysis">
					<button className="btn-blue" onClick={actions.toggleModal.bind(null, 'Jobs')}>
						<i className="fa fa-tasks"></i> Run Analysis
					</button>
	            </div>
			);
		}

		tools = tools.map((tool, index) => {
			if (tool.display) {
				return (
					<div role="presentation" className="tool" key={index}>
						<WarnButton
							tooltip={tool.tooltip}
							icon={tool.icon}
							prepDownload={tool.prepDownload}
							action={tool.action}
							warn={tool.warn}
							link={tool.link}
							validations={tool.validations} />
		            </div>
				);
			}
		});

		let snapshotOptions = snapshots.map((snapshot) => {
			return (
				<option key={snapshot._id} value={snapshot._id}>
					{snapshot.isOriginal ? 'original' : 'v' + snapshot.snapshot_version + ' (' + moment(snapshot.modified).format('lll') + ')'}
				</option>
			)
		});

		return (
			<div className="tools clearfix">
				<div role="presentation" className="snapshotSelect" >
					<span>
						<select value={this.props.selectedSnapshot} onChange={this._selectSnapshot}>
							<option value="" disabled>Select a snapshot</option>
							{snapshotOptions}
						</select>
					</span>
	            </div>
				{tools}
				{runAnalysis}
				<Share dataset={dataset} users={users} show={this.state.showShareModal} onHide={actions.toggleModal.bind(null, 'Share')}/>
				<Jobs
					dataset={dataset}
					apps={this.state.apps}
					loadingApps={this.state.loadingApps}
					snapshots={snapshots}
					show={this.state.showJobsModal}
					onHide={actions.toggleModal.bind(null, 'Jobs')} />
	        </div>
    	);
	},

// custom methods -----------------------------------------------------

	_selectSnapshot(e) {
		let snapshot;
		let snapshotId = e.target.value;
		for (let i = 0; i < this.state.snapshots.length; i++) {
			if (this.state.snapshots[i]._id == snapshotId) {
				snapshot = this.state.snapshots[i];
				break;
			}
		}
		actions.loadSnapshot(snapshot.isOriginal, snapshot._id);
	}

});

export default Tools;