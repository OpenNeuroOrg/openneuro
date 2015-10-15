// dependencies ----------------------------------------------------------------------

import React      from 'react';
import Reflux     from 'reflux';
import Actions    from './datasets.actions.js';
import bids       from '../utils/bids';
import userStore  from '../user/user.store.js';

// store setup -----------------------------------------------------------------------

let UploadStore = Reflux.createStore({

	listenables: Actions,

	init() {
		this.setInitialState();
	},

	getInitialState() {
		return this.data;
	},

// state data ------------------------------------------------------------------------

	data: {},

	update(data) {
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
	setInitialState(diffs) {
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

	getDatasets(isPublic) {
		let self = this;
        self.update({loading: true});
        bids.getDatasets(function (datasets) {
            self.update({datasets: datasets,  loading: false});
        }, !isPublic);
    },

    /**
     * Sort
     *
     */
    sort(value, direction) {
    	let datasets = this.data.datasets;
    	datasets = datasets.sort((a, b) => {
    		let aVal, bVal;

    		// format comparison data
    		if (value === 'name') {
	    		aVal = a[value].toLowerCase();
	    		bVal = b[value].toLowerCase();
	    	} else if (value === 'timestamp') {
	    		aVal = -Date.parse(a[value]);
	    		bVal = -Date.parse(b[value]);
	    	}

	    	// sort
    		if (direction == '+') {
	    		if (aVal > bVal) {return 1;}
	    		if (aVal < bVal) {return -1;}
	    	} else if (direction == '-') {
	    		if (aVal > bVal) {return -1;}
	    		if (aVal < bVal) {return 1;}
	    	}
    		return 0;
    	});
    	this.update({datasets});
    }

});

export default UploadStore;