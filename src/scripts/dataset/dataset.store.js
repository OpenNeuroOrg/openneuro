// dependencies ----------------------------------------------------------------------

import Reflux    from 'reflux';
import Actions   from './dataset.actions.js';
import scitran   from '../utils/scitran';
import bids      from '../utils/bids';
import router    from '../utils/router-container';
import userStore from '../user/user.store';
import upload    from '../utils/upload';
import config    from '../config';

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
	 * Update File
	 */
	updateFile(level, id, file, callback) {
		scitran.updateFile(level, id, filename, file, callback);
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

});

export default UserStore;