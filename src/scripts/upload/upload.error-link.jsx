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
	 * Generate Error Log 
	 *
	 * Takes an array of errors and an array of 
	 * warnings and returns text error log encoded
	 * as a url.
	 */
	_generateErrorLog (errors, warnings) {
		let issueString = this._generateIssueLog(errors, 'Error');
		issueString    += this._generateIssueLog(warnings, 'Warning');
		let errorURL    = "data:application/octet-stream;charset=utf-8," + encodeURIComponent(issueString);
		return errorURL;
	}

	/**
	 * Generate Issue Log
	 *
	 * Takes an array of issues and a string of the
	 * issue type and return a human readable log
	 * of the issues as a string.
	 */	
	_generateIssueLog (issues, type) {
		let issueString = '';
		let endLine = '======================================================';
		for (var i = 0; i < issues.length; i++) {
    		issueString += 'File Path: ' + issues[i].file.webkitRelativePath + '\n\n';
    		for (var j = 0; j < issues[i].errors.length; j++) {
        		var issue = issues[i].errors[j];
        		issueString += '\tType:\t\t' + type + '\n';
        		if (!issue) {continue;}
        		if (issue.reason)    {issueString += '\tReason:\t\t' + issue.reason + '\n';}
        		if (issue.line)      {issueString += '\tLine:\t\t' + issue.line + '\n';}
        		if (issue.character) {issueString += '\tCharacter:\t' + issue.character + '\n';}
        		if (issue.evidence)  {issueString += '\tEvidence:\t' + issue.evidence + '\n\n';}			
    		}
    		issueString += '\n' + endLine +'\n\n\n';
    	}
		return issueString;
	}
}