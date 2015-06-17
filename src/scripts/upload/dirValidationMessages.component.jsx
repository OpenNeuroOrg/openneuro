// dependencies -----------------------------------------------------------

import React from 'react'
import { Accordion, Panel } from 'react-bootstrap';
import Error from './error.component.jsx';

// component setup --------------------------------------------------------

let DirValidationMessages = React.createClass({

	propType: {
		errors: React.PropTypes.array
	},

// life cycle events ------------------------------------------------------

	render: function () {
		let errors = this.props.errors;
		let issues = errors.map(function (issue, index) {
			// issue header
			let header = (
				<span className="file-header">
					<strong>File:</strong> {issue.file.name}
					<span className="label label-danger pull-right">
						{issue.errors.length -1} {issue.errors.length > 0 ? "ERRORS" : "ERROR"}
					</span>
				</span>
			);
			// issue sub-errors
			let subErrors = issue.errors.map(function (error, index2) {
				return error ? <Error file={issue.file} error={error} index={index2} key={index2} /> : null;
			});
			// issue panel
			return (
				<Panel key={index} header={header} className="validation-error" eventKey={index}>
					{subErrors}
				</Panel>
			);
		});

		return <Accordion>{issues}</Accordion>
	},

// custom methods ---------------------------------------------------------

});

export default DirValidationMessages;