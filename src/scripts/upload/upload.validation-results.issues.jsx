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
		let issues = issueFiles.map((issue, index) => {
			let issueCount = pluralize('files', issue.files.length);

			let header = (
				<span className="file-header">
					<h4 className="em-header clearfix">
						<strong className="em-header pull-left">{this.props.issueType}: {index + 1}</strong>
					<span className="pull-right">
						 {issue.files.length} {issueCount}
					</span>
					</h4>
					{issue.reason}
				</span>
			);

			// issue sub-errors
			let subErrors = issue.files.map(function (error, index2) {
				return error ? <Issue type={self.props.issueType} file={issue.file} error={error} index={index2} key={index2} /> : null;
			});
			// issue panel
			return (
				<Panel key={index} header={header} className="validation-error fadeIn" eventKey={index}>
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