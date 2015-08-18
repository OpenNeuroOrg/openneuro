// dependencies -----------------------------------------------------------

import React from 'react';

// component setup --------------------------------------------------------

export default class ErrorLink extends React.Component {

// life cycle events ------------------------------------------------------
	
	render () {
		let dataURL = this._generateErrorLog(this.props.errors, this.props.warnings);
		return (
			<a download={this.props.dirName + "_errors.txt"} className="error-log" target="_blank" href={dataURL}>
				Download error log for {this.props.dirName}
			</a>
		);
	}

// custom methods ---------------------------------------------------------

	/**
	 * Call Error FN for both errors and warnings 
	 *
	 * 
	 */

	_generateErrorLog (errors, warnings) {
		let issueString = this.errorLog (errors, 'Error');
		issueString += this.errorLog (warnings, 'Warning');
		let errorURL = "data:application/octet-stream;charset=utf-8," + encodeURIComponent(issueString);
		return errorURL;

	}
		/**
	 * Generate Error Log
	 *
	 * Takes an array of errors and an array of
	 * warnings and returns a string to a
	 * txt data url of the contents.
	 */	
	errorLog (issues, type) {
		let issueString = '';
		let endLine = '======================================================';
		for (var i = 0; i < issues.length; i++) {
    		issueString += 'File Path: ' + issues[i].file.webkitRelativePath + '\n\n';
    		for (var j = 0; j < issues[i].errors.length; j++) {
        		var issue = issues[i].errors[j];
        		issueString += '\tType:\t\t' + type + '\n';
        		 if (!issue) {continue;}
        		 issueString += '\tReason:\t\t' + issue.reason + '\n' +
        		 				'\t@Line:\t\t' + issue.line + ' character: ' + issue.character + '\n'+
        		 				'\tEvidence:\t' + issue.evidence + '\n\n';	 				
    		}
    		issueString += '\n' + endLine +'\n\n\n';
    	}

		// let errorLog = JSON.stringify(issues, null, "  ");
		return issueString;
	}
}