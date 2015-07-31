// dependencies -----------------------------------------------------------

import React from 'react';

// component setup --------------------------------------------------------

export default class ErrorLink extends React.Component {

// life cycle events ------------------------------------------------------
	
	render () {
		let dataURL = this._generateErrorLog(this.props.errors, this.props.warnings);
		return (
			<a download={this.props.dirName + "_errors.json"} className="error-log" target="_blank" href={dataURL}>
				Download error log for {this.props.dirName}
			</a>
		);
	}

// custom methods ---------------------------------------------------------

	/**
	 * Generate Error Log
	 *
	 * Takes an array of errors and an array of
	 * warnings and returns a pretty printed
	 * JSON data url of the contents.
	 */
	_generateErrorLog (errors, warnings) {
		let issues = errors.concat(warnings);
		for (let issue of issues) {
			issue.file.path = issue.file.webkitRelativePath;
		}
		let errorLog = JSON.stringify(issues, null, "  ");
		let errorURL = "data:application/octet-stream;charset=utf-8," + encodeURIComponent(errorLog);
		return errorURL;
	}

}