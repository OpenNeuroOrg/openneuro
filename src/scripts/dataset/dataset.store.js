// dependencies ----------------------------------------------------------------------

import Reflux    from 'reflux';
import Actions   from './dataset.actions.js';
import scitran   from '../utils/scitran';
import bids      from '../utils/bids';
import router    from '../utils/router-container';
import userStore from '../user/user.store';

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
			userOwns: false,
			status: null
		};
		for (let prop in diffs) {data[prop] = diffs[prop];}
		this.update(data);
	},

// Actions ---------------------------------------------------------------------------

	updateDescription(key, value, callback) {
		let dataset = this.data.dataset;
		let description = dataset[0].description;
		description[key] = value;
		dataset[0].description = description;
		this.saveDescription(description, callback);
		this.update({dataset: dataset});
	},

	saveDescription(description, callback) {
		let self = this;
		let notes = this.data.dataset[0].notes;
		let hasDescription = false;
		for (let note of notes) {
			if (note.author === 'description') {
				hasDescription = true;
				note.text = JSON.stringify(description);
			}
		}
		if (!hasDescription) {
			notes.push({
				author: 'description',
				text: JSON.stringify(description)
			});
		}
		scitran.updateProject(this.data.dataset[0]._id, {notes: notes}, function (err, res) {
			callback();
		});
	},

	loadDataset(datasetId) {
		let self = this;
		self.update({loading: true, dataset: null});
		bids.getBIDSDataset(datasetId, function (res) {
			if (res.status === 404 || res.status === 403) {
				self.update({status: res.status, loading: false});
			} else {
				let userOwns = self._userOwns(res);
				self.update({dataset: res, loading: false, userOwns: userOwns});
			}
		});
	},

	publish(datasetId) {
		let self = this;
		scitran.updateProject(datasetId, {body: {public: true}}, function (err, res) {
			if (!err) {
				let dataset = self.data.dataset;
				dataset[0].public = true;
				self.update({dataset});
			}
		});
	},

	deleteDataset(datasetId) {
		let self = this;
		bids.deleteDataset(datasetId, function () {
            router.transitionTo('dashboard');
		});
	},

// helpers ---------------------------------------------------------------------------

	_userOwns(dataset) {
		let userOwns = false
		if (dataset && dataset[0].permissions)
		for (let user of dataset[0].permissions) {
			if (userStore.data.scitran._id === user._id) {
				userOwns = true;
			}
		}
		return userOwns;
	}

});

export default UserStore;