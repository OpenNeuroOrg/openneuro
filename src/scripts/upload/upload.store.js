// dependencies ----------------------------------------------------------------------

import React           from 'react';
import Reflux          from 'reflux';
import Actions         from './upload.actions.js';
import notifications   from '../notification/notification.actions.js';
import scitran         from '../utils/scitran';
import upload          from './upload';
import files           from '../utils/files';
import validate        from 'bids-validator';
import userStore       from '../user/user.store';
import datasetsActions from '../dashboard/datasets.actions';
import datasetActions  from '../dataset/dataset.actions';
import {Link}          from 'react-router';

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
	setInitialState: function (diffs, callback) {
		let data = {
			activeKey: 1,
			changeName: false,
			dirName: '',
			disabledTab: false,
			errors: [],
			list: {},
			nameError: null,
			progress: {total: 0, completed: 0, currentFiles: []},
			projectId: '',
			refs: {},
			resuming: false,
			selectedName: '',
			showModal: false,
			showSelect: true,
			showRename: false,
			renameEnabled: true,
			showRenameInput: true,
			showIssues: false,
			showResume: false,
			showProgress: false,
			showSuccess: false,
			tree: [],
			uploadStatus: 'not-started',
			warnings: [],
		};
		for (let prop in diffs) {data[prop] = diffs[prop];}
		this.update(data, callback);
	},

// actions ---------------------------------------------------------------------------

	/**
	 * Toggle Modal
	 */
	toggleModal () {
		if (this.data.uploadStatus === 'uploading') {
			this.update({showModal: !this.data.showModal});
		} else {
			this.setInitialState({showModal: !this.data.showModal});
		}
	},

	/**
	 * On Change
	 *
	 * On file select this adds files to the state
	 * and starts validation.
	 */
	onChange (selectedFiles) {
		let dirName = selectedFiles.tree[0].name,
		    nameError = null;
		if (dirName.length > 32) {
			nameError = 'Names must be 32 characters or less';
		}
		this.setInitialState({
			refs: this.data.refs,
			tree: selectedFiles.tree,
			list: selectedFiles.list,
			dirName: dirName,
			nameError: nameError,
			uploadStatus: 'files-selected',
			showModal: true,
			showRename: true,
			activeKey: 2
		});
	},

	/**
	 * On Resume
	 *
	 * A file select on change handler for resuming
	 * incomplete uploads.
	 */
	onResume (selectedFiles, originalName) {
		let dirName = selectedFiles.tree[0].name,
			renameEnabled = true,
			activeKey, callback;
		if (dirName !== originalName) {
			activeKey = 2;
		} else {
			activeKey = 3;
			renameEnabled = false;
			callback = () => {this.validate(selectedFiles.list);}
		}
		this.setInitialState({
			refs: this.data.refs,
			tree: selectedFiles.tree,
			list: selectedFiles.list,
			dirName: originalName,
			uploadStatus: 'files-selected',
			showRename: true,
			showModal: true,
			selectedName: dirName,
			renameEnabled: renameEnabled,
			showRenameInput: false,
			activeKey: activeKey,
			resuming: true
		}, callback);
	},

	/**
	 * Validate
	 *
	 * Takes a filelist, runs BIDS validation checks
	 * against it, and sets any errors to the state.
	 * Takes an optional boolean parameter representing
	 * whether this is already known as a resume.
	 */
	validate (selectedFiles) {
		let self = this;
		self.update({uploadStatus: 'validating', showIssues: true, activeKey: 3});
        validate.BIDS(selectedFiles, {}, function (errors, warnings) {

        	if (errors === 'Invalid') {
        		self.update({errors: 'Invalid'});
        	}

        	errors   = errors   ? errors   : [];
        	warnings = warnings ? warnings : [];

			self.update({
				errors: errors,
				warnings: warnings,
				uploadStatus: 'validated'
			});

			if (errors.length === 0 && warnings.length === 0) {
	        	self.checkExists(self.data.tree, false);
	        }
        });
	},

	/**
	 * Check Exists
	 *
	 * Takins a filetree and a boolean representing
	 * whether this is a resumed upload. If it isn't
	 * it check for existing dataset with the same name
	 * and group.
	 */
	checkExists (fileTree) {

		// rename dirName before upload
		fileTree[0].name = this.data.dirName;

		if (this.data.uploadStatus === 'dataset-exists') {
			this.upload(fileTree);
			return;
		}

		let self = this;
		let userId = userStore.data.scitran._id;
		if (!this.data.resuming) {
			scitran.getProjects(true, function (projects) {
				let existingProjectId;
				for (let project of projects) {
	                if (project.label === fileTree[0].name && project.group === userId) {
	                    existingProjectId = project._id;
	                    break;
	                }
	            }

	            if (existingProjectId) {
					self.update({uploadStatus: 'dataset-exists', showResume: true, activeKey: 4});
	            } else {
	            	self.upload(fileTree);
	            }
			});
		} else {
			self.upload(fileTree);
		}
	},

	/**
	 * Upload
	 *
	 * Uploads currently selected and triggers
	 * a progress event every time a file or folder
	 * finishes.
	 */
	upload (fileTree) {
		fileTree[0].name = this.data.dirName;
		let count = files.countTree(fileTree);

		this.update({
			uploadStatus: 'uploading',
			showModal: false,
			showProgress: true,
			disabledTab: true,
			activeKey: 5
		});

		let datasetsUpdated = false;

		upload.upload(userStore.data.scitran._id, fileTree, count, (progress, projectId) => {
			projectId = projectId ? projectId : this.data.projectId;
			this.update({progress: progress, uploading: true, projectId: projectId});
			if (!datasetsUpdated) {datasetsActions.getDatasets(); datasetsUpdated = true;}
			window.onbeforeunload = () => {return "You are currently uploading files. Leaving this site will cancel the upload process.";};
			if (progress.total === progress.completed) {
				let note = {author: 'uploadStatus', text: 'complete'};
				scitran.removeTag('projects', projectId, 'incomplete', (err, res) => {
                    this.uploadComplete(projectId);
                });
			}
		}, () => {
			this.uploadError();
		});
	},

	/**
	 * Upload Complete
	 *
	 * Resets the componenent state to its
	 * initial state. And creates an upload
	 * complete alert.
	 */
	uploadComplete (projectId) {
		let fileSelect = React.findDOMNode(this.data.refs.fileSelect);
		if (fileSelect) {fileSelect.value = null;} // clear file input

		let message = (
			<span><a href={"#/datasets/" + projectId}>{this.data.dirName}</a> has been added and saved to your dashboard.</span>
		);

		// refresh my datasets
		datasetsActions.getDatasets();
		// refresh current datset
		datasetActions.reloadDataset(projectId);

		notifications.createAlert({
			type: 'Success',
			message: message
		});
		this.setInitialState();
		window.onbeforeunload = function() {};
	},

	/**
	 * Upload Error
	 *
	 */
	uploadError () {
		let fileSelect = React.findDOMNode(this.data.refs.fileSelect);
		if (fileSelect) {fileSelect.value = null;} // clear file input

		// refresh my datasets
		datasetsActions.getDatasets();
		// refresh current datset
		datasetActions.reloadDataset(this.data.projectId);

		notifications.createAlert({
			type: 'Error',
			message: <span>There was an error uploading your dataset. Please refresh the page and try again. If the issue persists, contact the site <a  href="mailto:openfmri@gmail.com?subject=Upload%20Error" target="_blank">administrator</a>.</span>
		});
		this.setInitialState();
		window.onbeforeunload = function() {};
	},

	/**
	 * Update Directory Name
	 *
	 * Sets the directory name to the passed value.
	 */
	updateDirName(value) {
		let error = this.data.nameError;
		if (value.length > 32) {
			error = 'Names must be 32 characters or less.';
		} else if (value.length === 0 || /^\s+$/.test(value)) {
			error = 'Dataset must have a name.';
		} else {
			error = null;
		}

		this.update({
			dirName: value,
			showResume: false,
			nameError: error
		});
	},

	/**
	 * Select Tab
	 *
	 * Sets the state to open the selected tab
	 * in the upload menu.
	 */
	selectTab(activeKey) {
		this.update({activeKey});
	},

	/**
	 * Set Refs
	 *
	 * Takes a react refs and store them.
	 */
	setRefs(refs) {
		this.update({refs: refs});
	}

});

export default UploadStore;