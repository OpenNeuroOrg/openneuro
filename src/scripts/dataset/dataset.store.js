// dependencies ----------------------------------------------------------------------

import Reflux    from 'reflux';
import Actions   from './dataset.actions.js';
import scitran   from '../utils/scitran';
import bids      from '../utils/bids';
import router    from '../utils/router-container';
import userStore from '../user/user.store';
import upload    from '../utils/upload';
import config    from '../config';
import files     from '../utils/files';

let UserStore = Reflux.createStore({

// store setup -----------------------------------------------------------------------

	listenables: Actions,

	init: function () {
		this.setInitialState();
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
			loading: false,
			dataset: null,
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
	loadDataset(datasetId) {
		this.update({loading: true, dataset: null});
		bids.getDataset(datasetId, (res) => {
			if (res.status === 404 || res.status === 403) {
				this.update({status: res.status, loading: false});
			} else {
				this.update({dataset: res, loading: false});
			}
		});
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
	 * Publish
	 *
	 * Takes a datasetId and sets the datset to public.
	 */
	publish(datasetId) {
		let self = this;
		scitran.updateProject(datasetId, {public: true}, (err, res) => {
			if (!err) {
				let dataset = self.data.dataset;
				dataset.public = true;
				self.update({dataset});
			}
		});
	},

	/**
	 * Download Dataset
	 *
	 */
	downloadDataset() {
		scitran.getBIDSDownloadTicket(this.data.dataset._id, (err, res) => {
			let ticket = res.body.ticket;
			window.open(res.req.url.split('?')[0] + '?ticket=' + ticket);
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
		});
	},


	// Metadata ----------------------------------------------------------------------

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
		let authorsNote = {
			author: 'authors',
			text: JSON.stringify(description.Authors)
		}
		scitran.updateNote(datasetId, authorsNote, (err, res) => {
			let authors = [];
			for (let author of description.Authors) {
				authors.push(author.name);
			}
			description.Authors = authors;
			scitran.updateFileFromString('projects', datasetId, 'dataset_description.json', JSON.stringify(description), callback);
		});
	},

	/**
	 * Update Note
	 *
	 * Takes a name, value and callback and
	 * upserts a corresponding note for the
	 * current dataset.
	 */
	updateNote(name, value, callback) {
	 	let dataset = this.data.dataset;
	 	let note = {
	 		author: name,
	 		text: value
	 	};
	 	scitran.updateNote(dataset._id, note, callback);
	},

	 /**
	  * Update README
	  */
	updateREADME(value, callback) {
		scitran.updateFileFromString('projects', this.data.dataset._id, 'README', value, callback);
	},


	// Attachments -------------------------------------------------------------------

	/**
	 * Upload Attachment
	 *
	 * Takes a file and a callback and uploads
	 * the file to the current dataset.
	 */
	uploadAttachment(file, callback) {
		let request = {
			url: config.scitran.url + 'projects/' + this.data.dataset._id + '/file/' + file.name,
			file: file,
			tag: 'attachment',
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

			}
		};
		upload.add(request);
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
	downloadAttachment(filename) {
		scitran.getDownloadTicket('projects', this.data.dataset._id, filename, (err, res) => {
			let ticket = res.body.ticket;
			window.open(res.req.url + ticket);
		});
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

});

export default UserStore;