// dependencies -----------------------------------------------------------

import React from 'react'
import { Accordion, Panel } from 'react-bootstrap';
import pluralize from 'pluralize'
import Error from './error.component.jsx';


// component setup --------------------------------------------------------

class DirValidationMessages extends React.Component {

// life cycle events ------------------------------------------------------
	
	render () {
		let errors = this.props.issues;
		let issues = errors.map(function (issue, index) {
			let filesize = issue.file.size / 1000 + ' KB';
			let filetype = issue.file.type;
			let errorCount = pluralize('Error', issue.errors.length);
			// issue header
			let header = (
				<span className="file-header">
					{issue.file.name}
					<span className="pull-right">
						 {issue.errors.length} {errorCount}
					</span>
				</span>
			);


			// issue sub-errors
			let subErrors = issue.errors.map(function (error, index2) {
				return error ? <Error file={issue.file} error={error} index={index2} key={index2} /> : null;
			});
			// issue panel
			return (
				<Panel key={index} header={header} className="validation-error fadeIn" eventKey={index}>
					<span className="em-head clearfix">
						<strong className="em-header pull-left">Path to local file:</strong>
						<strong className="em-header pull-right">{filesize} | {filetype}</strong>
					</span>
					<span className="e-meta file-path">{issue.file.webkitRelativePath}</span>
					{subErrors}
				</Panel>
			);
		});

		return <Accordion>{issues}</Accordion>
	}

// custom methods ---------------------------------------------------------

}

DirValidationMessages.propTypes = {
	issues: React.PropTypes.array
};

export default DirValidationMessages;