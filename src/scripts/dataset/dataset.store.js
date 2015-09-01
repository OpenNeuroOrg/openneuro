// dependencies ----------------------------------------------------------------------

import Reflux  from 'reflux';
import Actions from './dataset.actions.js';
import scitran from '../utils/scitran';
import router  from '../utils/router-container';

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
			description: {
			    "Name": "The mother of all experiments",
			    "License": "CC0",
			    "Authors": ["Ramon y Cajal", "Harry Truman"],
			    "Acknowledgements": "say here what are your acknowledgments",
			    "HowToAcknowledge": "say here how you would like to be acknowledged",
			    "Funding": "list your funding sources",
			    "ReferencesAndLinks": "a paper / resource to be cited when using the data"
			}
		};
		for (let prop in diffs) {data[prop] = diffs[prop];}
		this.update(data);
	},

// Actions ---------------------------------------------------------------------------

	updateDescription(key, value) {
		let description = this.state.description;
		description[key] = value;
		this.update({description: description})
	},

	loadDataset(datasetId) {
		let self = this;
		self.update({loading: true, dataset: null});
		scitran.getBIDSDataset(datasetId, function (res) {
			if (res.status === 404 || res.status === 403) {
				self.update({status: res.status, loading: false});
			} else {
				self.update({dataset: res, loading: false});
			}
		});
	},

	publish(datasetId) {
		let self = this;
		scitran.updateProject(datasetId, {body: {public: true}}, function (err, res) {
			if (!err) {
				let dataset = self.state.dataset;
				dataset[0].public = true;
				self.update({dataset});
			}
		});
	},

	deleteDataset(datasetId) {
		let self = this;
		scitran.deleteDataset(datasetId, function () {
            router.transitionTo('dashboard');
		});
	},

});

export default UserStore;