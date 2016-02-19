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
		let isSuperuser  = JSON.parse(window.localStorage.scitranUser).root;


		let tools = [
			{
				tooltip: 'Download Dataset',
				icon: 'fa-download',
				prepDownload: actions.getDatasetDownloadTicket.bind(this, this.state.snapshot),
				action: actions.incrementDownloadTicket,
				display: true
			},
			{
				tooltip: 'Make Dataset Public',
				icon: 'fa-globe',
				action: actions.publish.bind(this, dataset._id, true),
				display: isAdmin && isSnapshot && !isPublic && !isIncomplete,
				warn: true
			},
			{
				tooltip: 'Un-Publish Dataset',
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
				tooltip: 'Run Analysis',
				icon: 'fa-tasks',
				action: actions.toggleModal.bind(null, 'Jobs'),
				display: isSignedIn && !isIncomplete && isSnapshot,
				warn: false
			},
			{
				tooltip: 'Create Snapshot',
				icon: 'fa-camera-retro',
				action: actions.createSnapshot,
				display: isAdmin && !isSnapshot && !isIncomplete,
				warn: true
			},
		];

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
							link={tool.link} />
		            </div>
				);
			}
		});

		let snapshotOptions = snapshots.map((snapshot) => {
			return (
				<option key={snapshot._id} value={JSON.stringify(snapshot)}>
					{snapshot.isOriginal ? 'original' : 'v' + snapshot.snapshot_version + ' (' + moment(snapshot.modified).format('lll') + ')'}
				</option>
			)
		});

		return (
			<div className="tools clearfix">
				{tools}
				<Share dataset={dataset} users={users} show={this.state.showShareModal} onHide={actions.toggleModal.bind(null, 'Share')}/>
				<Jobs dataset={dataset} apps={this.state.apps} loadingApps={this.state.loadingApps} show={this.state.showJobsModal} onHide={actions.toggleModal.bind(null, 'Jobs')} />

				<div role="presentation" className="tool" >
					<select onChange={this._selectSnapshot} defaultValue="">
						<option value="" disabled>Select a snapshot</option>
						{snapshotOptions}
					</select>
	            </div>
	        </div>
    	);
	},

// custon methods -----------------------------------------------------

	_selectSnapshot: (e) => {
		let snapshot = JSON.parse(e.target.value);
		actions.loadSnapshot(snapshot.isOriginal, snapshot._id);
	}

});

export default Tools;