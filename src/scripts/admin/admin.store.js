// dependencies ----------------------------------------------------------------------

import Reflux    from 'reflux';
import Actions   from './admin.actions.js';
import scitran   from '../utils/scitran';
import crn       from '../utils/crn';
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

	update: function (data, callback) {
		for (let prop in data) {this.data[prop] = data[prop];}
		this.trigger(this.data, callback);
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
			users: [],
			blacklist: [],
			showBlacklistModal: false,
			showUserModal: false,
			newUserForm: {
				_id: '',
				firstname: '',
				lastname: ''
			},
			blacklistForm: {
				_id: '',
				firstname: '',
				lastname: '',
				note: ''
			},
			newUserError: '',
			blacklistError: ''
		};
		for (let prop in diffs) {data[prop] = diffs[prop];}
		this.update(data);
	},

// Actions ---------------------------------------------------------------------------

	/**
	 * Add User
	 */
	addUser(user, callback) {
		if (!this.data.newUserForm._id || !this.data.newUserForm.firstname || !this.data.newUserForm.lastname) {
			this.update({newUserError: 'Email address, first name and last name are required.'});
		} else {
			this.update({newUserError: ''});
			scitran.addUser(this.data.newUserForm, (err, res) => {
				let users = this.data.users;
				users.push(this.data.newUserForm);
				this.update({
					users: users,
					newUserForm: {
						_id: '',
						firstname: '',
						lastname: ''
					},
					showUserModal: false
				});
			});
		}
	},

	/**
	 * Blacklist Submit
	 *
	 * Parses form for blacklisting a user.
	 */
	blacklistSubmit () {
		let blacklistForm = this.data.blacklistForm;

		if (!blacklistForm._id) {
			this.update({blacklistError: 'Email address is required.'});
		} else {
			this.update({blacklistError: ''});

			// check if blacklisted user is a current user
			let userExists, userIndex;
			for (let i = 0; i < this.data.users.length; i++) {
				let user = this.data.users[i];
				if (user._id === blacklistForm._id) {
					userExists = true;
					userIndex  = i;
					break;
				}
			}

			if (userExists) {
				this.removeUser(blacklistForm._id, userIndex, () => {
					this.blacklistUser(this.data.blacklistForm);
				});
			} else {
				this.blacklistUser(this.data.blacklistForm);
			}
		}
	},

	/**
	 * Blacklist User
	 *
	 * Takes a gmail address and a first and last
	 * name and adds the user as a blacklisted user.
	 */
	blacklistUser(userInfo) {
		crn.blacklistUser(userInfo, (err, res) => {
			let blacklist = this.data.blacklist;
			blacklist.push(userInfo);
			this.update({
				blacklist: blacklist,
				blacklistForm: {
					_id: '',
					firstname: '',
					lastname: '',
					note: ''
				},
				showBlacklistModal: false
			});
		});
	},

	/**
	 * Blacklist Modal
	 *
	 * Triggers a modal for blacklisting a user.
	 * Prefills data if a user object is passesed.
	 */
	blacklistModal(user) {
		this.update({
			showBlacklistModal: true,
			blacklistForm: {
				_id:       user._id       ? user._id : '',
				firstname: user.firstname ? user.firstname: '',
				lastname:  user.lastname  ? user.lastname : '',
				note: ''
			}
		});
	},

	/**
	 * Clear Form
	 */
	clearForm(form) {
		let formData = this.data[form];
		for (let key in formData) {
			formData[key] = '';
		}
		let data = {};
		data[form] = formData;
		this.update(data);
	},

	/**
	 * Get Users
	 */
	getUsers() {
		scitran.getUsers((err, res) => {
			this.update({users: res.body});
		});
	},

	/**
	 * Get Blacklist
	 */
	getBlacklist() {
		crn.getBlacklist((err, res) => {
			this.update({blacklist: res.body});
		});
	},

	/**
	 * Input Change
	 */
	inputChange (form, name, value) {
		let formData = this.data[form];
		formData[name] = value;
		let data = {};
		data[form] = formData;
		this.update(data);
	},

	/**
	 * Remove User
	 *
	 * Takes a userId and removes the user.
	 */
	removeUser (userId, index, callback) {
		scitran.removeUser(userId, (err, res) => {
			let users = this.data.users;
			users.splice(index, 1);
			this.update({users});
			callback();
		});
	},

	/**
	 * Toggle Super User
	 */
	toggleSuperUser (user, callback) {
		scitran.updateUser(user._id, {wheel: !user.wheel}, (err, res) => {
			let users = this.data.users;
			for (let existingUser of users) {
				if (existingUser._id === user._id) {
					user.wheel = !user.wheel;
				}
			}
			this.update({users: users});
			callback();
		});
	},

	/**
	 * Unblacklist User
	 */
	unBlacklistUser(userId) {
		crn.unBlacklistUser(userId, (err, res) => {
			let blacklist = this.data.blacklist;
			for (let i = 0; i < blacklist.length; i++) {
				let user = blacklist[i];
				if (user._id === userId) {
					blacklist.splice(i, 1);
					break;
				}
			}
			this.update({blacklist});
		});
	}

});

export default UserStore;