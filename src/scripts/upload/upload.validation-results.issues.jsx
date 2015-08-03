// dependencies -----------------------------------------------------------

import React from 'react';
import { Accordion, Panel } from 'react-bootstrap';
import pluralize from 'pluralize';
import Issue from './upload.validation-results.issues.issue.jsx';


// component setup --------------------------------------------------------

class Issues extends React.Component {

// life cycle events ------------------------------------------------------
	
	render () {
		let self = this;
		let issueFiles = this.props.issues;
		let issues = issueFiles.map(function (issue, index) {
			let filesize = issue.file.size / 1000 + ' KB';
			let filetype = issue.file.type;
			let issueCount = pluralize(self.props.issueType, issue.errors.length);

			let header = (
				<span className="file-header">
					{issue.file.name}
					<span className="pull-right">
						 {issue.errors.length} {issueCount}
					</span>
				</span>
			);


			// issue sub-errors
			let subErrors = issue.errors.map(function (error, index2) {
				return error ? <Issue type={self.props.issueType} file={issue.file} error={error} index={index2} key={index2} /> : null;
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

		return <Accordion>{issues}</Accordion>;
	}

// custom methods ---------------------------------------------------------

}

Issues.propTypes = {
	issues: React.PropTypes.array.isRequired,
	issueType: React.PropTypes.string.isRequired
};


export default Issues;