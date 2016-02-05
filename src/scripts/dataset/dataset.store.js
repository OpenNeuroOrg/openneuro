// dependencies ----------------------------------------------------------------------

import Reflux    from 'reflux';
import Actions   from './dataset.actions.js';
import scitran   from '../utils/scitran';
import crn       from '../utils/crn';
import bids      from '../utils/bids';
import router    from '../utils/router-container';
import userStore from '../user/user.store';
import upload    from '../utils/upload';
import config    from '../config';
import files     from '../utils/files';

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

	update: function (data) {
		for (let prop in data) {this.data[prop] = data[prop];}
		this.trigger(this.data);
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
			dataset: null,
			loading: false,
			loadingApps: false,
			loadingJobs: false,
			jobs: [],
			showJobsModal: false,
			showShareModal: false,
			snapshot: false,
			snapshots: [],
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
		let snapshot = !!(options && options.snapshot)
		this.update({loading: true, dataset: null});
		bids.getDataset(datasetId, (res) => {
			if (res.status === 404 || res.status === 403) {
				this.update({status: res.status, loading: false, snapshot: snapshot});
			} else {
				this.update({dataset: res, loading: false, snapshot: snapshot});
			}
			// if (res.original) {datasetId = res.original;}
			let originalId = res.original ? res.original : datasetId;
			this.loadJobs(datasetId);
			this.loadSnapshots(originalId, datasetId);
		}, options);
	},

	/**
	 * Load Snapshot
	 *
	 * Takes a snapshot ID and loads the snapshot.
	 */
	loadSnapshot(created, snapshotId) {
		if (created === 'original') {
			router.transitionTo('dataset', {datasetId: snapshotId});
		} else {
			router.transitionTo('snapshot', {snapshotId: snapshotId});
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
				this.loadDataset(this.data.dataset._id);
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
            this.update({jobs: res.body, loadingJobs: false});
        });
	},

	/**
	 * Load Apps
	 */
	loadApps() {
		this.update({loadingApps: true});
		crn.getApps((err, res) => {
			this.update({apps: res.body, loadingApps: false});
		});
	},

	/**
	 * Publish
	 *
	 * Takes a datasetId and sets the datset to public.
	 */
	publish(datasetId) {
		if (this.data.snapshot) {
			scitran.updateSnapshotPublic(datasetId, true, (err, res) => {
				if (!err) {
					let dataset = this.data.dataset;
					dataset.public = true;
				}
			});
		} else {
			/** this should be removed eventually as only snapshots can be publish **/
			scitran.updateProject(datasetId, {public: true}, (err, res) => {
				if (!err) {
					let dataset = this.data.dataset;
					dataset.public = true;
					this.update({dataset});
				}
			});
			/** this should be removed eventually as only snapshots can be publish **/
		}
	},

	/**
	 * Download Dataset
	 *
	 */
	downloadDataset(snapshot) {
		// open download window as synchronous action from click to avoid throwing popup blockers
		window.open('', 'bids-download');
		scitran.getBIDSDownloadTicket(this.data.dataset._id, (err, res) => {
			let ticket = res.body.ticket;
			let downloadWindow = window.open(res.req.url.split('?')[0] + '?ticket=' + ticket, 'bids-download');
			setTimeout(() => {downloadWindow.close();}, 1000);
		}, {snapshot: !!snapshot});
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
		scitran.updateProject(this.data.dataset._id, {name: value}, () => {
			this.updateDescription('Name', value, callback);
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
		let description = dataset.description;
		description[key] = value;
		if (key !== 'Authors'){description.Authors = dataset.authors;}
		this.saveDescription(description, callback);
		this.update({dataset: dataset});
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
	 * Download Attachment
	 *
	 * Takes a filename and starts a downloads
	 * for the file within the current dataset.
	 */
	downloadAttachment(filename, snapshot) {
		// open download window as synchronous action from click to avoid throwing popup blockers
		window.open('', 'attachment-download');
		scitran.getDownloadTicket('projects', this.data.dataset._id, filename, (err, res) => {
			let ticket = res.body.ticket;
			let downloadWindow = window.open(res.req.url.split('?')[0] + '?ticket=' + ticket, 'attachment-download');
			setTimeout(() => {downloadWindow.close();});
		}, {snapshot: !!snapshot});
	},

	// File Structure ----------------------------------------------------------------

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
			});
		}
	},

	/**
	 * Delete File
	 */
	deleteFile(file) {
		let dataset = this.data.dataset;
		scitran.deleteFile(file.parentContainer, file.parentId, file.name, (err, res) => {
			let match = files.findInTree([dataset], file.parentId);
			let children = [];
			for (let existingFile of match.children) {
				if (file.filename !== existingFile.filename) {
					children.push(existingFile);
				}
			}
			match.children = children;
			this.update({dataset});
		});
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
			this.updateFileState(item, {error: null, loading: true});
			scitran.updateFile(level, id, file, (err, res) => {
				this.updateFileState(item, {loading: false});
			});
		}
	},

	/**
	 * Update Directory State
	 *
	 */
	updateDirectoryState(directoryId, changes) {
		let dataset = this.data.dataset;
		let match = files.findInTree([dataset], directoryId);
		if (match) {
			for (let key in changes) {
				match[key] = changes[key];
			}
		}
		this.update({dataset});
	},

	/**
	 * Update File State
	 *
	 * Take a file object and changes to be
	 * made and applies those changes by
	 * updating the state of the file tree
	 */
	updateFileState(file, changes) {
		let dataset = this.data.dataset;
		let parent = files.findInTree([dataset], file.parentId);
		let children = [];
		for (let existingFile of parent.children) {
			if (file.filename == existingFile.filename) {
				for (let key in changes) {
					existingFile[key] = changes[key];
				}
			}
		}
		this.update({dataset});
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
		this.updateDirectoryState(directory._id, {showChildren: !directory.showChildren});
	},

	// Jobs --------------------------------------------------------------------------

	/**
	 * Start Job
	 */
	startJob(appName, appId, parameters, callback) {
		crn.createJob({
			name: appName,
			appId: appId,
			datasetId: this.data.dataset._id,
			userId: userStore.data.scitran._id,
			parameters: parameters
		}, (err, res) => {
			callback(err, res);
			// callback(err, {message: "Your analysis has been submitted. Periodically check the analysis section of this dataset to view the status and results."});
			this.loadJobs(this.data.dataset._id);
		});
	},

	/**
	 * Download Result
	 */
	downloadResult(jobId, fileName) {
		// open download window as synchronous action from click to avoid throwing popup blockers
		window.open('', 'bids-result');
		crn.getResultDownloadTicket(jobId, fileName, (err, res) => {
			let ticket = res.body._id;
			let downloadWindow = window.open(config.crn.url + 'jobs/' + jobId + '/results/' + fileName + '?ticket=' + ticket, 'bids-result');
			// close download window after 3 seconds
			setTimeout(() => {downloadWindow.close();}, 3000);
		});
	},

	// Snapshots ---------------------------------------------------------------------

	createSnapshot() {
		scitran.createSnapshot(this.data.dataset._id, (err, res) => {
			router.transitionTo('snapshot', {snapshotId: res.body._id});
		});
	},

	loadSnapshots(datasetId) {
		scitran.getProjectSnapshots(datasetId, (err, res) => {
			let snapshots = res.body;
			snapshots.unshift({
				isOriginal: true,
				_id: datasetId
			});
			this.update({snapshots: res.body});
		});
	}

});

export default datasetStore;