// dependencies -------------------------------------------------------

import React from 'react';

// component setup ----------------------------------------------------

class Error extends React.Component {

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
		if (errLocation == '') {errLocation  = 'Evidence: ';}

		return (
			<div className="row">
				<div className="col-xs-12">
					<h4>Error: {index + 1}</h4>
					<span className="error-meta">
						<label>Path: </label>
						<p>{file.webkitRelativePath}</p>
					</span>
					<span className="error-meta">
						<label>
							{errLocation}
						</label>
						<p>{error.evidence}</p>
					</span>
					<span className="error-meta">
						<label>Reason: </label>
						<p>{error.reason}</p>
					</span>
					<span className="error-meta">
						<p>{(file.size / 1000) + " KB"} | {file.type}</p>
					</span>
				</div>
			</div>
    	);
	}

// custom methods -----------------------------------------------------

}

Error.propTypes = {
	file: React.PropTypes.object,
	error: React.PropTypes.object
};

export default Error;