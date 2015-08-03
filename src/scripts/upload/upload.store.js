// dependencies ----------------------------------------------------------------------

import Reflux   from 'reflux';
import Actions  from './upload.actions.js';
import scitran  from '../utils/scitran';
import files    from '../utils/files';
import validate from 'bids-validator';

let UploadStore = Reflux.createStore({

// store setup -----------------------------------------------------------------------

	listenables: Actions,

	getInitialState: function () {
		return this.data;
	},

// state data ------------------------------------------------------------------------

	data: {
		tree: [],
		list: {},
		errors: [],
		warnings: [],
		dirName: '',
		alert: false,
		uploading: false,
		validating: false,
		totalErrors: 0,
		totalWarnings: 0,
		progress: {total: 0, completed: 0, currentFiles: []},
	},

	update: function (data) {
		for (let prop in data) {this.data[prop] = data[prop];}
		this.trigger(this.data);
	},

// actions ---------------------------------------------------------------------------

	/**
	 * On Change
	 *
	 * On file select this adds files to the state
	 * and starts validation.
	 */
	onChange (selectedFiles) {
		this.update({
			tree: selectedFiles.tree,
			list: selectedFiles.list,
			dirName: selectedFiles.tree[0].name,
			validating: true,
		});
		this.validate(selectedFiles);
	},

	/**
	 * Validate
	 *
	 * Takes a filelist, runs BIDS validation checks
	 * against it, and sets any errors to the state.
	 */
	validate (selectedFiles) {
		let self = this;

        validate.BIDS(selectedFiles.list, function (errors, warnings) {
        	
        	if (errors === 'Invalid') {
        		self.update({errors: 'Invalid'});
        		return;
        	}

        	errors   = errors   ? errors   : [];
        	warnings = warnings ? warnings : [];

        	let totalErrors = 0;  
        	let totlalWarnings = 0;
			for (let error   of errors)   {totalErrors    += error.errors.length;}
            for (let warning of warnings) {totlalWarnings += warning.errors.length;}

			self.update({
				errors: errors,
				totalErrors: totalErrors,
				warnings: warnings,
				totalWarnings: totlalWarnings
			});

			if (errors.length === 0) {
				if (warnings.length === 0) {
					self.upload(selectedFiles.tree);
					self.update({uploading: true});
				}
			}
        });
	},

	/**
	 * Upload
	 *
	 * Uploads currently selected and triggers
	 * a progress event every time a file or folder
	 * finishes.
	 */
	upload (fileTree) {
		let self = this;
		let count = files.countTree(fileTree);

		scitran.upload(fileTree, count, function (progress) {
			self.update({progress: progress, uploading: true});
			window.onbeforeunload = function() {return "You are currently uploading files. Leaving this site will cancel the upload process.";};
			if (progress.total === progress.completed) {
				self.uploadComplete();
			}
		});
	},

	/**
	 * Upload Complete
	 *
	 * Resets the componenent state to its
	 * initial state. And creates an upload
	 * complete alert.
	 */
	uploadComplete () {
		this.update({
			tree: [],
			list: {},
			errors: [],
			warnings: [],
			dirName: '',
			alert: true,
			uploading: false,
			validating: false,
			totalErrors: 0,
			totalWarnings: 0,
			progress: {total: 0, completed: 0, currentFiles: []},
		});
		window.onbeforeunload = function() {};
	},

});

export default UploadStore;