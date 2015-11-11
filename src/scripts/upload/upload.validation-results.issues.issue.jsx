// dependencies -------------------------------------------------------

import React from 'react';

// component setup ----------------------------------------------------

export default class Issue extends React.Component {

// life cycle events --------------------------------------------------

	render () {
		let self = this;
		let file  = this.props.file;
		let error = this.props.error;
		let index = this.props.index;

		// build error location string
		let errLocation = '';
		if (error.line)        {errLocation += 'Line: ' + error.line + ' ';}
		if (error.character)   {errLocation += 'Character: ' + error.character + '';}
		if (errLocation == '' && error.evidence) {errLocation  = 'Evidence: ';}

		return (
			<div className="em-body">
				<h4 className="em-header clearfix">
					<strong className="em-header pull-left">{error.file.name}</strong>
					<strong className="em-header pull-right">{error.file.size / 1000} KB| {error.file.type}</strong>
				</h4>
				<span className="e-meta">
					<label>Location: </label>
					<p>{error.file.webkitRelativePath}</p>
					<label>Reason: </label>
					<p>{error.reason}</p>
				</span>
				<span className="e-meta">
					<label>
						{errLocation}
					</label>
					<p>{error.evidence}</p>
				</span>
			</div>
    	);
	}

// custom methods -----------------------------------------------------

}

Issue.propTypes = {
	file: React.PropTypes.object,
	error: React.PropTypes.object,
	type: React.PropTypes.string.isRequired
};