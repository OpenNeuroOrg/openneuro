// dependencies -------------------------------------------------------

import React     from 'react';
import pluralize from 'pluralize';

export default class Messages extends React.Component {

// life cycle events --------------------------------------------------

	render () {
		let errors   = this.props.errors,
		    warnings = this.props.warnings,
		    uploading = this.props.uploading,
		    tree     = this.props.tree;

		let totalErrors = 0;  
    	let totalWarnings = 0;
		for (let error   of errors)   {totalErrors    += error.errors.length;}
        for (let warning of warnings) {totalWarnings += warning.errors.length;}

		let warningCount = pluralize('Warning', totalWarnings);
		let errorCount = pluralize('Error', totalErrors);

		let notBIDSMessage = <span className="message error fadeIn">This does not appear to be a BIDS dataset. <a href="http://bids.neuroimaging.io" target="_blank">Click to view details on BIDS specification</a></span>;
		let initialMessage = <span className="message fadeIn">Upload a BIDS dataset.<br/> <small><a href="http://bids.neuroimaging.io" target="_blank">Click to view details on BIDS specification</a></small></span>;
		let warningsMessage = <span className="message error fadeIn">We found {totalWarnings} {warningCount} in your dataset. Proceed with this dataset by clicking continue or fix the issues and select your folder again.</span>;
		let errorMessage = (
			<span className="message error fadeIn">Your dataset is not a valid BIDS dataset. Fix the <strong>{totalErrors} {errorCount}</strong> and upload your dataset again.<br/> 
				<small><a href="http://bids.neuroimaging.io" target="_blank">Click to view details on BIDS specification</a></small>
			</span>
		);


		return (
			<span>
				{errors == 'Invalid' ? notBIDSMessage : null}
				{!uploading && tree.length === 0 && errors.length === 0 ? initialMessage : null }
				{tree.length > 0 && errors.length === 0 && warnings.length > 0 ? warningsMessage : null}
				{tree.length > 0 && errors.length > 0 ? errorMessage : null}
			</span>
    	);
	}

// custom methods -----------------------------------------------------

}

// Messages.props = {
// 	fileSelected: ,
// 	errors: [],
// 	warnings: []
// }
