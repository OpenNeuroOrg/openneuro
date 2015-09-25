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
		dataset.description = description;
		this.saveDescription(description, callback);
		this.update({dataset: dataset});
	},

	/**
	 * Save Description
	 *
	 * Takes a description object and updates
	 * the JSON description note.
	 */
	saveDescription(description, callback) {
		let note = {
			author: 'dataset_description.json',
			text: JSON.stringify(description)
		};
		scitran.updateNote(this.data.dataset._id, note, (err, res) => {
			callback();
		});
	},

	/**
	 * Update README
	 *
	 * Takes a values and updates the current
	 * dataset README.
	 */
	updateREADME(value, callback) {
		let dataset = this.data.dataset;
		let note = {
			author: 'README',
			text: value
		};
		scitran.updateNote(dataset._id, note, callback);
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