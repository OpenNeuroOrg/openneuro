// dependencies ----------------------------------------------------------------------

import Reflux  from 'reflux';
import Actions from './navbar.actions.js';

let UserStore = Reflux.createStore({

// store setup -----------------------------------------------------------------------

	listenables: Actions,

	init() {
		this.setInitialState();
	},

	getInitialState() {
		return this.data;
	},

// data ------------------------------------------------------------------------------

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

		};
		for (let prop in diffs) {data[prop] = diffs[prop];}
		this.update(data);
	},

// Actions ---------------------------------------------------------------------------

	/**
	 * Toggle Modal
	 */
	toggleModal(name) {

	},

});

export default UserStore;