// dependencies ----------------------------------------------------------------------

import React     from 'react';
import Reflux    from 'reflux';
import Actions   from './datasets.actions.js';
import scitran   from '../utils/scitran';

// store setup -----------------------------------------------------------------------

let UploadStore = Reflux.createStore({

	listenables: Actions,

	init: function () {
		this.setInitialState();
	},

	getInitialState: function () {
		return this.data;
	},

// state data ------------------------------------------------------------------------

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
            datasets: [],
            resultsPerPage: 30,
            page: 0
		};
		for (let prop in diffs) {data[prop] = diffs[prop];}
		this.update(data);
	},

// actions ---------------------------------------------------------------------------

	getDatasets: function () {
		let self = this;
        self.update({loading: true});
        scitran.getProjects(function (datasets) {
            datasets.reverse();
            self.update({datasets: datasets,  loading: false});
        });
    }

});

export default UploadStore;