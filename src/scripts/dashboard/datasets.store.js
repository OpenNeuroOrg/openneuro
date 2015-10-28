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

	update(data, callback) {
		for (let prop in data) {this.data[prop] = data[prop];}
		this.trigger(this.data, () => {
			if (callback) {callback();}
		});
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
            visibleDatasets: [],
            resultsPerPage: 30,
            page: 0,
            sort: {
            	value: 'timestamp',
            	direction: '+'
            },
            filters: []
		};
		for (let prop in diffs) {data[prop] = diffs[prop];}
		this.update(data);
	},

// actions ---------------------------------------------------------------------------

	/**
	 * Get Datasets
	 *
	 * Takes a boolean representing whether the
	 * request is for public datasets and gets
	 * a list of datasets and sorts by the current
	 * sort setting.
	 */
	getDatasets(isPublic) {
		let self = this;
        self.update({
        	loading: true,
            sort: {
            	value: 'timestamp',
            	direction: '+'
            },
            filters: []
        }, () => {
	        bids.getDatasets((datasets) => {
	            this.sort(null, null, datasets);
	        }, !isPublic);
	    });
    },

    /**
     * Filter
     *
     * Takes a value and toggles whether datasets
     * with that value are shown.
     */
    filter(value) {

    	// set filters
    	let filters = this.data.filters;
    	let index = filters.indexOf(value);
    	if(value === 'reset'){
    		filters = [];
    	}else if (index > -1) {
    		filters.splice(index, 1);
    	} else {
    		filters.push(value);
    	}

    	// filter data
    	let visibleDatasets = this.data.datasets;
    	if (filters.length > 0) {
    		let results = [];
	    	for (let dataset of visibleDatasets) {

	    		// public
	    		if (filters.indexOf('public') > -1 && dataset.public) {
	    			results.push(dataset);
	    		}

	    		// incomplete
	    		if (filters.indexOf('incomplete') > -1 && dataset.status.uploadIncomplete) {
	    			results.push(dataset);
	    		}

	    		// shared
	    		if (filters.indexOf('shared') > -1 && dataset.sharedWithMe) {
	    			results.push(dataset);
	    		}

	    	}
	    	visibleDatasets = results;
	    }

    	// update state
    	this.update({filters, visibleDatasets});
    },


    /**
     * Sort
     *
     * Takes a value and a direction (+ or -) and
     * sorts the current datasets acordingly.
     */
    sort(value, direction, datasets) {
    	value     = value     ? value     : this.data.sort.value;
    	direction = direction ? direction : this.data.sort.direction;
    	datasets  = datasets  ? datasets  : this.data.datasets;
    	datasets  = datasets.sort((a, b) => {

    		// format comparison data
    		let aVal, bVal;
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
    	this.update({
    		datasets,
    		visibleDatasets: datasets,
    		sort: {
    			value,
    			direction
    		},
    		loading: false
    	});
    }

});

export default UploadStore;