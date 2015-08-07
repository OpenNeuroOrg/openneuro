// dependencies -------------------------------------------------------

import React     from 'react';
import pluralize from 'pluralize';
import Spinner   from '../common/partials/spinner.component.jsx';

export default class Messages extends React.Component {

// life cycle events --------------------------------------------------

	render () {

		// short references
		let errors    = this.props.errors,
		    warnings  = this.props.warnings,
		    uploading = this.props.uploadStatus === 'uploading';

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
		let specLink        = <small><a href="http://bids.neuroimaging.io" target="_blank">Click to view details on BIDS specification</a></small>;
		let notBIDSMessage  = <span className="message error fadeIn">This does not appear to be a BIDS dataset. {specLink}</span>;
		let initialMessage  = <span className="message fadeIn">Upload a BIDS dataset.<br/> {specLink}</span>;
		let warningsMessage = <span className="message error fadeIn">We found {warningCount} in your dataset. Proceed with this dataset by clicking continue or fix the issues and select your folder again.</span>;
		let errorMessage    = <span className="message error fadeIn">Your dataset is not a valid BIDS dataset. Fix the <strong>{errorCount}</strong> and upload your dataset again.<br/> {specLink}</span>;
		let noErrorMessage  = <span className="message fadeIn">Proceed with this datset by clicking continue or select a different folder.</span>;
		let resumeMessage   = <span className="message fadeIn">You have already uploaded a dataset with this name. Click continue if you are trying to resume an unfinished upload.</span>;

		let message;
		if (errors === 'Invalid') {
			message = notBIDSMessage;
		} else if (this.props.uploadStatus === 'not-started') {
			message = initialMessage;
		} else if (this.props.uploadStatus === 'dataset-exists') {
			message = resumeMessage;
		} else if (errors.length > 0) {
			message = errorMessage;
		}  else if (warnings.length > 0) {
			message = warningsMessage;
		} else if (this.props.uploadStatus === 'files-selected') {
			message = noErrorMessage;
		}

		return (
			<span>
				<Spinner text="validating" active={this.props.uploadStatus === 'validating'}/>
				{message}
			</span>
    	);
	}

}
