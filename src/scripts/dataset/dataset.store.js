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
			status: null
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

	saveDescription(description, callback) {
		let self = this;
		let notes = this.data.dataset.notes;
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
		scitran.updateProject(this.data.dataset._id, {notes: notes}, (err, res) => {
			callback();
		});
	},

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

	publish(datasetId) {
		let self = this;
		scitran.updateProject(datasetId, {body: {public: true}}, (err, res) => {
			if (!err) {
				let dataset = self.data.dataset;
				dataset.public = true;
				self.update({dataset});
			}
		});
	},

	deleteDataset(datasetId) {
		bids.deleteDataset(datasetId, () => {
            router.transitionTo('dashboard');
		});
	}

});

export default UserStore;