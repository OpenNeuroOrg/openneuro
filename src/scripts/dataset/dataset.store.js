// dependencies ----------------------------------------------------------------------

import Reflux    from 'reflux';
import Actions   from './dataset.actions.js';
import scitran   from '../utils/scitran';
import bids      from '../utils/bids';
import router    from '../utils/router-container';
import userStore from '../user/user.store';
import upload    from '../utils/upload';

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

	updateDescription(key, value, callback) {
		let dataset = this.data.dataset;
		let description = dataset.description;
		description[key] = value;
		dataset.description = description;
		this.saveDescription(description, callback);
		this.update({dataset: dataset});
	},

	updateDigitalDocuments(file) {
		let request = {
			url: 'projects/' + this.data.dataset._id + '/file/' + file.name,
			file: file,
			tag: 'attachment',
			progressStart: () => {console.log('upload started');},
			progressEnd: () => {console.log('upload complete');}
		};
		upload.add(request);
	},

	saveDescription(description, callback) {
		let note = {
			author: 'description',
			text: JSON.stringify(description)
		};
		scitran.updateNote(this.data.dataset._id, note, (err, res) => {
			callback();
		});
	},

	updateREADME(value, callback) {
		let dataset = this.data.dataset;
		let note = {
			author: 'README',
			text: value
		};
		scitran.updateNote(dataset._id, note, callback);
	},

	loadDataset(datasetId) {
		this.update({loading: true, dataset: null});
		// this.loadUsers();
		bids.getDataset(datasetId, (res) => {
			if (res.status === 404 || res.status === 403) {
				this.update({status: res.status, loading: false});
			} else {
				this.update({dataset: res, loading: false});
			}
		});
	},

	loadUsers() {
		scitran.getUsers((err, res) => {
			this.update({users: res.body});
		});
	},

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

	deleteDataset(datasetId) {
		bids.deleteDataset(datasetId, () => {
            router.transitionTo('datasets');
		});
	}

});

export default UserStore;