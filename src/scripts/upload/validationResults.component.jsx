// dependencies -----------------------------------------------------------

import React from 'react';
import pluralize from 'pluralize';
import {Accordion, Panel} from 'react-bootstrap';
import DirValidationMessages from './dirValidationMessages.component.jsx';

// component setup --------------------------------------------------------

export default class ValidationResults extends React.Component {

// life cycle events ------------------------------------------------------
	
	render () {
		let errors = this.props.errors;
		let warnings = this.props.warnings;

		// errors
		let errorsWrap;
		if (errors.length > 0) {
			let totalErrors = this._countIssues(errors);
			let errorHeader = <span>{totalErrors} {pluralize('error', totalErrors)} in {errors.length} {pluralize('error', errors.length)}</span>;
			errorsWrap = (
				<Panel className="fadeInDown upload-panel error-wrap" header={errorHeader}  eventKey='1'>
					<DirValidationMessages issues={errors} issueType="Error"/> 
				</Panel>
			);
		}
		
		//warnings
		let warningWrap;
		if (warnings.length > 0) {
			let totalWarnings = this._countIssues(warnings);
			let warningHeader = <span>{totalWarnings} {pluralize('warning', totalWarnings)} in {warnings.length} {pluralize('warning', warnings.length)}</span>;
			warningWrap = (
				<Panel className="fadeInDown upload-panel warning-wrap" header={warningHeader}  eventKey='2'>
					<DirValidationMessages issues={warnings} issueType="Warning" />
				</Panel>
			);
		}

		// validations errors and warning wraps
		return (
			<Accordion className="validation-messages" accordion>
				{errorsWrap}
				{warningWrap}
			</Accordion>
		);
	}

// custom methods ---------------------------------------------------------

	_countIssues(issues) {
		let numIssues = 0;
		for (let issue of issues) {numIssues += issue.errors.length;}
		return numIssues;
	}

}

ValidationResults.propTypes = {
	errors:   React.PropTypes.array,
	warnings: React.PropTypes.array
};

ValidationResults.Props = {
	errors:   [],
	warnings: []
};