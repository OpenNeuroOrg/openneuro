// dependencies -------------------------------------------------------

import React       from 'react';
import Reflux      from 'reflux';
import pluralize   from 'pluralize';
import Actions     from './upload.actions.js';
import UploadStore from './upload.store.js';
import Results     from './upload.validation-results.jsx';
import Spinner     from '../common/partials/spinner.component.jsx';
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
			for (let error   of errors)   {totalErrors    += error.errors.length;}
	        for (let warning of warnings) {totalWarnings  += warning.errors.length;}
			warningCount = totalWarnings + ' ' + pluralize('Warning', totalWarnings);
			errorCount   = totalErrors   + ' ' + pluralize('Error', totalErrors);
		}

		// messages
		let specLink        = <span>Click to view details on <a href="http://bids.neuroimaging.io" target="_blank">BIDS specification</a>.</span>;
		let notBIDSMessage  = <span className="message error fadeIn">This does not appear to be a BIDS dataset.<br/> {specLink}</span>;
		let warningsMessage = <span className="message error fadeIn">We found {warningCount} in your dataset. Proceed with this dataset by clicking continue or fix the issues and select your folder again.</span>;
		let errorMessage    = <span className="message error fadeIn">Your dataset is not a valid BIDS dataset. Fix the <strong>{errorCount}</strong> and upload your dataset again.<br/> {specLink}</span>;
		let noErrorMessage  = <span className="message fadeIn">Proceed with this dataset by clicking continue or select a different folder.</span>;
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
				<Results errors={errors} warnings={warnings} />
				{errors.length > 0 && errors !== 'Invalid' || warnings.length > 0 ? <ErrorLink dirName={dirName} errors={errors} warnings={warnings} /> : null}
				{errors.length === 0 ? <button className="btn-blue" onClick={this._upload.bind(null, tree)}>Continue</button> : null}
			</div>
		);

		return (
			<div>
				{this.state.uploadStatus === 'validating' ? loading : results}
			</div>
    	);
	},

// custom methods -----------------------------------------------------

	_upload: Actions.checkExists

});


export default Issues;