// dependencies ----------------------------------------------------------------------

import Reflux      from 'reflux';
import Actions     from './dataset.actions.js';
import scitran     from '../utils/scitran';
import crn         from '../utils/crn';
import bids        from '../utils/bids';
import router      from '../utils/router-container';
import userStore   from '../user/user.store';
import userActions from '../user/user.actions';
import upload      from '../utils/upload';
import config      from '../../../config';
import files       from '../utils/files';

let datasetStore = Reflux.createStore({

// store setup -----------------------------------------------------------------------

	listenables: Actions,

	init: function () {
		this.setInitialState();
		this.loadApps();
	},

	getInitialState: function () {
		return this.data;
	},

// data ------------------------------------------------------------------------------

	data: {},

	update: function (data, callback) {
		for (let prop in data) {this.data[prop] = data[prop];}
		this.trigger(this.data, callback);
	},

	/**
	 * Set Initial State
	 *
	 * Sets the state to the data object defined
	 * inside the function. Also takes a diffs object
	 * which will set the state to the initial state
	 * with any differences passed.
	 */
	setInitialState: function (diffs) {
		let data = {
			apps: [],
			currentUpdate: null,
			dataset: null,
			datasetTree: null,
			loading: false,
			loadingApps: false,
			loadingJobs: false,
			loadingTree: false,
			jobs: [],
			metadataIssues: {},
			showJobsModal: false,
			showPublishModal: false,
			showShareModal: false,
			showUpdateModal: false,
			snapshot: false,
			snapshots: [],
			selectedSnapshot: '',
			status: null,
			users: []
		};
		for (let prop in diffs) {data[prop] = diffs[prop];}
		this.update(data);
	},

// Actions ---------------------------------------------------------------------------

	// Dataset -----------------------------------------------------------------------

	/**
	 * Load Dataset
	 *
	 * Takes a datasetId and loads the dataset.
	 */
	loadDataset(datasetId, options) {
		options = options ? options : {};
		options.isPublic = !userStore.data.token;
		let snapshot = !!(options && options.snapshot)
		this.update({loading: true, dataset: null});
		bids.getDataset(datasetId, (res) => {
			// res.showChildren = true;
			if (res.status === 404 || res.status === 403) {
				this.update({status: res.status, loading: false, snapshot: snapshot});
			} else {
				this.update({dataset: res, loading: false, snapshot: snapshot, selectedSnapshot: datasetId});
			}
			let originalId = res.original ? res.original : datasetId;
			this.loadJobs(datasetId);
			this.loadSnapshots(originalId);
		}, options);
	},

	/**
	 * Load Dataset Tree
	 */
	loadDatasetTree(datasetId, options) {
		this.update({loadingTree: true});
		bids.getDatasetTree(this.data.dataset, (tree) => {
			this.update({loadingTree: false, datasetTree: tree});
		}, {snapshot: this.data.snapshot});
	},

	/**
	 * Load Snapshot
	 *
	 * Takes a snapshot ID and loads the snapshot.
	 */
	loadSnapshot(isOriginal, snapshotId) {
		let datasetId = this.data.dataset.original ? this.data.dataset.original : this.data.dataset._id;
		if (isOriginal) {
			router.transitionTo('dataset', {datasetId: snapshotId});
		} else {
			router.transitionTo('snapshot', {datasetId, snapshotId});
		}
	},

	/**
	 * Reload Dataset
	 *
	 * Optionally takes a datasetId and only reloads
	 * the dataset if that ID matches the current ID.
	 * If no ID is passed it reloads the current ID.
	 */
	reloadDataset(datasetId) {
		if (this.data.dataset) {
			if (!datasetId) {
				this.loadDataset(this.data.dataset._id, {snapshot: this.data.snapshot});
			}else if (this.data.dataset._id == datasetId) {
				this.loadDataset(datasetId);
			}
		}
	},

	/**
	 * Load Users
	 *
	 * Loads a list of all users.
	 */
	loadUsers() {
		scitran.getUsers((err, res) => {
			this.update({users: res.body});
		});
	},

	/**
	 * Load Jobs
	 */
	loadJobs(projectId) {
		this.update({loadingJobs: true});
		crn.getDatasetJobs(projectId, (err, res) => {
			// sort jobs by app
			let jobs = {};
			for (let job of res.body) {
				if (!jobs.hasOwnProperty(job.appId)) {
					jobs[job.appId] = {
						appLabel:   job.appLabel,
						appVersion: job.appVersion,
						runs: [job]
					};
				} else {
					jobs[job.appId].runs.push(job);
				}
			}
			// convert jobs to array
			let jobArray = [];
			for (let job in jobs) {
				jobArray.push({
					appId:      job,
					appLabel:   jobs[job].appLabel,
					appVersion: jobs[job].appVersion,
					runs:       jobs[job].runs
				});
			}

            this.update({jobs: jobArray, loadingJobs: false});
        }, {snapshot: this.data.snapshot});
	},

	/**
	 * Load Apps
	 */
	loadApps() {
		this.update({loadingApps: true});
		crn.getApps((err, res) => {
			if (res.body) {
				res.body.sort((a, b) => {
					let aName = a.label.toUpperCase();
					let bName = b.label.toUpperCase();
					return (aName < bName) ? -1 : (aName > bName) ? 1 : 0;
				});
			}
			this.update({apps: res.body, loadingApps: false});
		});
	},

	/**
	 * Publish
	 *
	 * Takes a snapshotId, value and callback and sets the
	 * datasets public status to the passed value.
	 */
	publish(snapshotId, value, callback) {
		scitran.updateSnapshotPublic(snapshotId, value, (err, res) => {
			if (callback) {callback()};
			if (!err) {
				if (snapshotId === this.data.dataset._id) {
					let dataset = this.data.dataset;
					dataset.public = value;
					this.update({dataset});
				} else {
					let datasetId = this.data.snapshot ? this.data.dataset.original : this.data.dataset._id;
					router.transitionTo('snapshot', {datasetId, snapshotId});
				}
			}
		});
	},

	getDatasetDownloadTicket(snapshot, callback) {
		scitran.getBIDSDownloadTicket(this.data.dataset._id, (err, res) => {
			let ticket = res.body.ticket;
			let downloadUrl = res.req.url.split('?')[0] + '?ticket=' + ticket;
			callback(downloadUrl);
		}, {snapshot: !!snapshot});
	},

	/**
	 * Track Download
	 *
	 * Tracks download and increments download
	 * count (client side only) to provide immediate
	 * download feedback.
	 */
	trackDownload(callback) {
		scitran.trackUsage(this.data.dataset._id, 'download', (err, res) => {
			let dataset = this.data.dataset;
			dataset.downloads++;
			this.update({dataset});
			callback();
		});
	},

	/**
	 * Delete Dataset
	 *
	 * Takes a datsetId, deletes the dataset, and returns the user
	 * to the my datasets page.
	 */
	deleteDataset(datasetId) {
		bids.deleteDataset(datasetId, () => {
            router.transitionTo('datasets');
		}, {snapshot: this.data.snapshot});
	},

	/**
	 * Toggle Modal
	 */
	toggleModal(name) {
		let updates = {};
		updates['show' + name + 'Modal'] = !this.data['show' + name + 'Modal'];
		this.update(updates);
	},


	// Metadata ----------------------------------------------------------------------

	updateName(value, callback) {
		scitran.updateProject(this.data.dataset._id, {label: value}, () => {
			// update description
			this.updateDescription('Name', value, callback);

			// update filetree
			let dataset     = this.data.dataset;
			let datasetTree = this.data.datasetTree;
			dataset.label = value;
			if (datasetTree && datasetTree[0]) {
				datasetTree[0].label = value;
			}
			this.update({dataset, datasetTree});
		});
	},

	/**
	 * Update Description
	 *
	 * Takes a key and a value and updates the dataset
	 * description JSON note accordingly.
	 */
	updateDescription(key, value, callback) {
		let dataset = this.data.dataset;
		let metadataIssues = this.data.metadataIssues;
		let description = dataset.description;
		description[key] = value;
		if (key !== 'Authors') {
			description.Authors = dataset.authors;
		} else {
			metadataIssues.authors = null;
		}
		this.saveDescription(description, callback);
		this.update({dataset, metadataIssues});
	},

	/**
	 * Save Description
	 *
	 * Takes a description object and upserts
	 * the JSON description file.
	 */
	saveDescription(description, callback) {
		let datasetId = this.data.dataset._id;
		scitran.updateProject(datasetId, {metadata: {authors: description.Authors}}, (err, res) => {
			let authors = [];
			for (let author of description.Authors) {
				authors.push(author.name);
			}
			description.Authors = authors;
			scitran.updateFileFromString('projects', datasetId, 'dataset_description.json', JSON.stringify(description), 'application/json', ['project'], callback);
		});
	},

	/**
	 * Update README
	 */
	updateREADME(value, callback) {
		scitran.updateFileFromString('projects', this.data.dataset._id, 'README', value, '', [], callback);
	},

	/**
	 * Dismiss Metadata Issue
	 */
	dismissMetadataIssue(key) {
		let metadataIssues = this.data.metadataIssues;
		metadataIssues[key] = null;
		this.update({metadataIssues});
	},

	// Attachments -------------------------------------------------------------------

	/**
	 * Upload Attachment
	 *
	 * Takes a file and a callback and uploads
	 * the file to the current dataset.
	 */
	uploadAttachment(file, callback) {
		let attachmentExists, fileExists;
		for (let attachment of this.data.dataset.attachments) {
			if (attachment.name === file.name) {
				attachmentExists = true;
			}
		}

		for (let existingFile of this.data.dataset.children) {
			if (existingFile.name === file.name) {
				fileExists = true;
			}
		}

		if (attachmentExists) {
			callback({error: '"' + file.name + '" has already been uploaded. Multiple attachments with the same name are not allowed.'});
		} else if (fileExists) {
			callback({error: 'You cannot upload a file named "' + file.name + '" as an attachment because it already exists in the dataset.'});
		} else {
			let request = {
				url: config.scitran.url + 'projects/' + this.data.dataset._id + '/files',
				file: file,
				tags: ['attachment'],
				progressStart: () => {},
				progressEnd: () => {
					bids.getDataset(this.data.dataset._id, (res) => {
						let dataset = this.data.dataset;
						dataset.attachments = res.attachments;
						this.update({dataset: dataset});
						callback();
					});
				},
				error: (err, req) => {
					callback({error: 'There was an error uploading your attachment. Please try again and contact the site administrator if the issue persists.'});
				}
			};
			upload.add(request);
		}
	},

	/**
	 * Delete Attachment
	 *
	 * Takes a filename and index and deletes
	 * the attachment from the current dataset.
	 */
	deleteAttachment(filename, index) {
		scitran.deleteFile('projects', this.data.dataset._id, filename, (err, res) => {
			let dataset = this.data.dataset;
			dataset.attachments.splice(index, 1);
			this.update({dataset});
		});
	},

	/**
	 * Get Attachment Download Ticket
	 *
	 * Takes a filename and callsback with a direct
	 * download url for an attachment.
	 */
	getAttachmentDownloadTicket(filename, callback) {
		scitran.getDownloadTicket('projects', this.data.dataset._id, filename, (err, res) => {
			let ticket = res.body.ticket;
			let downloadUrl = res.req.url.split('?')[0] + '?ticket=' + ticket;
			callback(downloadUrl);
		}, {snapshot: !!this.data.snapshot});
	},

	// File Structure ----------------------------------------------------------------

	/**
	 * Update Warning
	 *
	 * Throws a modal to warn the user about consequences of
	 * dataset modifications.
	 */
	updateWarn(type, file, action) {
		userActions.getPreferences((preferences) => {
			if (preferences && preferences.ignoreUpdateWarnings) {
				action();
			} else {
				this.update({
					currentUpdate: {
						message: type + ' ' + file.name,
						action: action
					},
					showUpdateModal: true
				});
			}
		});
	},

	/**
	 * Disable Update Warning
	 *
	 * Disables the update warning modal
	 */
	disableUpdateWarn(callback) {
		userActions.updatePreferences({ignoreUpdateWarnings: true}, callback);
	},

	/**
	 * Add File
	 */
	addFile(container, file) {
		let exists;
		for (let existingFile of container.children) {
			if (existingFile.name === file.name) {
				exists = true;
			}
		}

		if (exists) {
			this.updateDirectoryState(container._id, {error: '"' + file.name + '" already exists in this directory.'});
		} else {
			this.updateWarn('add', file, () => {
				this.updateDirectoryState(container._id, {loading: true});
				scitran.updateFile(container.containerType, container._id, file, () => {
					let children = container.children
					children.unshift({
						filename: file.name,
						name: file.name,
						parentContainer: container.containerType,
						parentId: container._id
					});
					this.updateDirectoryState(container._id, {children: children, loading: false});
					this.revalidate();
				});
			});
		}
	},

	/**
	 * Delete File
	 */
	deleteFile(file) {
		this.updateWarn('delete', file, () => {
			let datasetTree = this.data.datasetTree;
			scitran.deleteFile(file.parentContainer, file.parentId, file.name, (err, res) => {
				let match = files.findInTree(datasetTree, file.parentId);
				let children = [];
				for (let existingFile of match.children) {
					if (file.name !== existingFile.name) {
						children.push(existingFile);
					}
				}
				match.children = children;
				this.update(datasetTree);
				this.revalidate();
			});
		});
	},

	/**
	 * Update File
	 */
	updateFile(item, file) {
		let id       = item.parentId,
			level    = item.parentContainer,
			filename = item.name;

		if (filename !== file.name) {
			this.updateFileState(item, {
				error: 'You must replace a file with a file of the same name.'
			});
		} else {
			this.updateWarn('update', file, () => {
				this.updateFileState(item, {error: null, loading: true});
				scitran.updateFile(level, id, file, (err, res) => {
					this.updateFileState(item, {loading: false});
					this.revalidate();
				});
			});
		}
	},

	/**
	 * Re Validate
	 *
	 * Used after any modification and must be run
	 * only after the modification is complete. Downloads
	 * and validates the dataset server side. Updates status
	 * tags and validation results on dataset.
	 */
	revalidate() {
		let dataset = this.data.dataset;
		scitran.addTag('projects', dataset._id, 'validating', (err, res) => {
			dataset.status.validating = true;
			this.update({dataset});
			crn.validate(dataset._id, (err, res) => {
				let validation = res.body;
				dataset.status.validating = false;
				dataset.validation = validation;
				dataset.status.invalid = validation.errors && (validation.errors == 'Invalid' || validation.errors.length > 0);
				this.update({dataset});
			});
		});
	},

	/**
	 * Get File Download Ticket
	 *
	 * Takes a filename and callsback with a
	 * direct download url.
	 */
	getFileDownloadTicket(file, callback) {
		scitran.getDownloadTicket(file.parentContainer, file.parentId, file.name, (err, res) => {
			let ticket = res.body.ticket;
			let downloadUrl = res.req.url.split('?')[0] + '?ticket=' + ticket;
			callback(downloadUrl);
		}, {snapshot: this.data.snapshot});
	},

	/**
	 * Dismiss Error
	 */
	dismissError(item) {
		if (item.children) {
			this.updateDirectoryState(item._id, {error: ''});
		} else {
			this.updateFileState(item, {error: ''});
		}
	},

	/**
	 * Update Directory State
	 *
	 */
	updateDirectoryState(directoryId, changes, callback) {
		let dataset = this.data.datasetTree;
		let match = files.findInTree(dataset, directoryId);
		if (match) {
			for (let key in changes) {
				match[key] = changes[key];
			}
		}
		this.update({datasetTree: dataset}, callback);
	},

	/**
	 * Update File State
	 *
	 * Take a file object and changes to be
	 * made and applies those changes by
	 * updating the state of the file tree
	 */
	updateFileState(file, changes, callback) {
		let dataset = this.data.dataset;
		let parent = files.findInTree([dataset], file.parentId);
		let children = [];
		for (let existingFile of parent.children) {
			if (file.name == existingFile.name) {
				for (let key in changes) {
					existingFile[key] = changes[key];
				}
			}
		}
		this.update({dataset}, callback);
	},

	/**
	 * Toggle Folder
	 *
	 * Takes the id of a container in the
	 * current dataset and toggles its showChildren
	 * boolean which determines whether container
	 * children are shown in the tree hierarchy UI.
	 */
	toggleFolder(directory) {
		if (directory.label === this.data.dataset.label && !this.data.datasetTree) {
			this.loadDatasetTree();
		} else {
			this.updateDirectoryState(directory._id, {showChildren: !directory.showChildren});
		}
	},

	// Jobs --------------------------------------------------------------------------

	/**
	 * Start Job
	 */
	startJob(snapshotId, app, parameters, callback) {
		crn.createJob({
			appId: app.id,
			appLabel: app.label,
			appVersion: app.version,
			datasetId: snapshotId,
			executionSystem: app.executionSystem,
			userId: userStore.data.scitran._id,
			parameters: parameters
		}, (err, res) => {
			callback(err, res);
			if (!err) {
				if (snapshotId == this.data.dataset._id) {
					this.loadJobs(snapshotId);
				}
			}
		});
	},

	/**
	 * Dismiss Job Modal
	 */
	dismissJobsModal(success, snapshotId) {
		this.toggleModal('Jobs');
		if (success) {
			if (snapshotId !== this.data.dataset._id) {
				let datasetId = this.data.dataset.original ? this.data.dataset.original : this.data.dataset._id;
				router.transitionTo('snapshot', {datasetId, snapshotId});
			}
		}
	},

	/**
	 * Get Result Download Ticket
	 */
	getResultDownloadTicket(jobId, fileName, callback) {
		crn.getResultDownloadTicket(jobId, fileName, (err, res) => {
			let ticket = res.body._id;
			let downloadUrl = config.crn.url + 'jobs/' + jobId + '/results/' + fileName + '?ticket=' + ticket;
			callback(downloadUrl);
		});
	},

	// Snapshots ---------------------------------------------------------------------

	createSnapshot(callback, transition) {
		let datasetId = this.data.dataset.original ? this.data.dataset.original : this.data.dataset._id;
		transition    = transition == undefined ? true : transition;

		scitran.getProject(datasetId, (res) => {
			let project = res.body;
			if (project.metadata && project.metadata.authors && project.metadata.authors.length < 1) {
				let metadataIssues = this.data.metadataIssues;
				let message = 'Your dataset must list at least one author before creating a snapshot.';
				metadataIssues.authors = message;
				this.update({metadataIssues});
				callback({error: message});
			} else if (project.metadata.hasOwnProperty('validation') && project.metadata.validation.errors.length > 0) {
				callback({error: 'You cannot snapshot an invalid dataset. Please fix the errors and try again.'});
			} else {
				scitran.createSnapshot(datasetId, (err, res) => {
					if (transition) {
						router.transitionTo('snapshot', {datasetId: this.data.dataset._id, snapshotId: res.body._id});
					}
					this.loadSnapshots(datasetId, () => {
						if (callback){callback(res.body._id)};
					});
				});
			}
		});
	},

	loadSnapshots(datasetId, callback) {
		scitran.getProjectSnapshots(datasetId, (err, res) => {
			scitran.getProject(datasetId, (res1) => {
				let snapshots = !err && res.body ? res.body : [];
				snapshots.reverse();
				if (res1.statusCode !== 404 && res1.statusCode !== 403) {
					snapshots.unshift({
						isOriginal: true,
						_id: datasetId
					});
				}
				this.update({snapshots: snapshots});
				if (callback) {callback();}
			});
		});
	},

	// usage analytics ---------------------------------------------------------------

	trackView (snapshotId) {
		scitran.trackUsage(snapshotId, 'view', (err, res) => {});
	}

});

export default datasetStore;