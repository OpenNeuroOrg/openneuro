// dependencies ----------------------------------------------------------------------

import Reflux    from 'reflux';
import Actions   from './admin.actions.js';
import scitran   from '../utils/scitran';
import crn       from '../utils/crn';

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
            loadingUsers: true,
            searchInput:'',
            adminFilter: false,
            blacklist: [],
            modals: {
                blacklist: false,
                defineJob: false
            },
            blacklistForm: {
                _id: '',
                firstname: '',
                lastname: '',
                note: ''
            },
            jobDefinitionForm: {
                name: '',
                jobRoleArn: '',
                containerImage: '',
                command: '',
                vcpus: '1',
                memory: '2000'
            },
            blacklistError: ''
        };
        for (let prop in diffs) {data[prop] = diffs[prop];}
        this.update(data);
    },

// Actions ---------------------------------------------------------------------------

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
    * Search username and email
    */
    searchUser (input) {
        this.filter(input, this.data.adminFilter);
    },

    /**
    * filter admin
    */
    filterAdmin () {
        this.filter(this.data.searchInput, !this.data.adminFilter);
    },

    filter (searchInput, adminFilter) {
        let users = this.data.users;

        for (let user of users) {

            user.visible = true;
            searchInput = searchInput.toLowerCase();

            let admin = user.root === true,
                lastName = user.lastname,
                firstName = user.firstname,
                userName = firstName +' '+lastName,
                userSearchStrings = (
                    user.email.toLowerCase().includes(searchInput) ||
                    userName.toLowerCase().includes(searchInput)
                );

            // search filtering
            if (searchInput.length != 0 && !userSearchStrings) {
                user.visible = false;
            }

            // button filtering
            if (!admin && adminFilter) {
                user.visible = false;
            }
        }
        this.update({users, searchInput, adminFilter, loadingUsers: false});
    },

    /**
     * Blacklist User
     *
     * Takes a gmail address and a first and last
     * name and adds the user as a blacklisted user.
     */
    blacklistUser(userInfo) {
        crn.blacklistUser(userInfo, () => {
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
     * Prefills data if a user object is passed.
     */
    blacklistModal(user, callback) {
        let modals = this.data.modals;
        modals.blacklist = true;
        this.update({
            modals,
            blacklistError: '',
            blacklistForm: {
                _id:       user._id       ? user._id : '',
                firstname: user.firstname ? user.firstname: '',
                lastname:  user.lastname  ? user.lastname : '',
                note: ''
            }
        });
        if (callback && typeof callback === 'function') {
            callback();
        }
    },

    /**
     * Get Users
     *
     * Retrieves a list of all users and saves it to the
     * admin store state.
     */
    getUsers() {
        scitran.getUsers((err, res) => {
            this.update({users: res.body}, () => {
                this.searchUser('');
            });
        });
    },

    /**
     * Get Blacklist
     *
     * Retrieves a list of all blacklisted users and saves
     * it to the admin store state.
     */
    getBlacklist() {
        crn.getBlacklist((err, res) => {
            this.update({blacklist: res.body});
        });
    },

    /**
     * Input Change
     *
     * Handles input change state management for
     * admin form data.
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
        scitran.removeUser(userId, () => {
            let users = this.data.users;
            users.splice(index, 1);
            this.update({users});
            if (callback) {callback();}
        });
    },

    /**
     * Toggle Modal
     */
    toggleModal (modalName) {
        let modals = this.data.modals;
        modals[modalName] = !modals[modalName];
        this.update({modals});
    },

    /**
     * Toggle Super User
     */
    toggleSuperUser (user, callback) {
        scitran.updateUser(user._id, {root: !user.root}, () => {
            let users = this.data.users;
            for (let existingUser of users) {
                if (existingUser._id === user._id) {
                    user.root = !user.root;
                }
            }
            this.update({users: users});
            if(callback){
                callback();
            }
        });
    },

    /**
     * Unblacklist User
     */
    unBlacklistUser(userId) {
        crn.unBlacklistUser(userId, () => {
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