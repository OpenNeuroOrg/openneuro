// dependencies -------------------------------------------------------

import React from 'react';

// component setup ----------------------------------------------------

let Error = React.createClass({

	propTypes: {
		file: React.PropTypes.object,
		error: React.PropTypes.object
	},

// life cycle events --------------------------------------------------

	render: function () {
		let file  = this.props.file;
		let error = this.props.error;
		let index = this.props.index;
		return (
			<div className="row">
				<div className="col-xs-12">
					<h4>Error: {index + 1}</h4>
					<span className="error-meta">
						<label>Path: </label>
						<p>{file.webkitRelativePath}</p>
					</span>
					<span className="error-meta">
						<label>Line: {error.line} Character: {error.character}</label>
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

});

export default Error;



