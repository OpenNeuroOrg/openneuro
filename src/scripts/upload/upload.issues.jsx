// dependencies -------------------------------------------------------

import React       from 'react';
import Reflux      from 'reflux';
import pluralize   from 'pluralize';
import Actions     from './upload.actions.js';
import UploadStore from './upload.store.js';
import Results     from './upload.validation-results.jsx';
import Spinner     from '../common/partials/spinner.jsx';
import ErrorLink   from './upload.error-link.jsx';

let Issues = React.createClass({

	mixins: [Reflux.connect(UploadStore)],

// life cycle events --------------------------------------------------

	render () {

		// short references
		let tree     = this.state.tree;
		let errors   = this.state.errors;
		let warnings = this.state.warnings;
		let dirName  = this.state.dirName;

		// counts
		let totalErrors = 0;
    	let totalWarnings = 0;
    	let warningCount,
    		errorCount;
    	if (errors !== 'Invalid') {
			totalErrors   = errors.length;
	        totalWarnings = warnings.length;
			warningCount = totalWarnings + ' ' + pluralize('Warning', totalWarnings);
			errorCount   = totalErrors   + ' ' + pluralize('Error', totalErrors);
		}
		let uploadResetLink = <span className="upload-reset-link" onClick={this._reset}>select your folder again</span>
		// messages
		let specLink        = <span className="bids-link">Click to view details on <a href="http://bids.neuroimaging.io" target="_blank">BIDS specification</a></span>;
		let notBIDSMessage  = <span className="message error fadeIn">This does not appear to be a BIDS dataset. <span className="upload-reset-link" onClick={this._reset}>Select a new folder</span> and try again.</span>;
		let warningsMessage = <span className="message error fadeIn">We found {warningCount} in your dataset. Proceed with this dataset by clicking continue or fix the issues and {uploadResetLink}.</span>;
		let errorMessage    = <span className="message error fadeIn">Your dataset is not a valid BIDS dataset. Fix the <strong>{errorCount}</strong> and {uploadResetLink}.</span>;
		let noErrorMessage  = <span className="message fadeIn">Proceed with this dataset by clicking continue or {uploadResetLink}.</span>;
		let resumeMessage   = <span className="message fadeIn">You have already uploaded a dataset with this name. Click continue if you are trying to resume an unfinished upload.</span>;

		// determine message
		let message;
		if (errors === 'Invalid') {
			message = notBIDSMessage;
		} else if (errors.length > 0) {
			message = errorMessage;
		}  else if (warnings.length > 0) {
			message = warningsMessage;
		} else {
			message = noErrorMessage;
		}

		// loading animation
		let loading = <Spinner text="validating" active={this.state.uploadStatus === 'validating'}/>;

		// results
		let results = (
			<div>
				{message}
				{errors !== 'Invalid' ? <Results errors={errors} warnings={warnings} /> : null}
				{errors.length === 0 ? <button className="btn-blue" onClick={this._upload.bind(null, tree, false)}>Continue</button> : null}
				{errors.length > 0 && errors !== 'Invalid' || warnings.length > 0 ? <ErrorLink dirName={dirName} errors={errors} warnings={warnings} /> : null}
				{specLink}
			</div>
		);

		return (
			<div>
				{this.state.uploadStatus === 'validating' ? loading : results}
			</div>
    	);
	},

// custom methods -----------------------------------------------------

	_upload: Actions.checkExists,

	_reset: function () {
		Actions.selectTab(1);
	}

});


export default Issues;