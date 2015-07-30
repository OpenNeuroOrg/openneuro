// dependencies -----------------------------------------------------------

import React from 'react';
import {ProgressBar} from 'react-bootstrap';

// component setup --------------------------------------------------------

export default class UploadProgress extends React.Component {

// life cycle events ------------------------------------------------------
	
	render () {
		let progress = this.props.progress.total > 0 ? Math.floor(this.props.progress.completed / this.props.progress.total * 100) : 0;

		let currentFiles = this.props.progress.currentFiles.map(function (file, index) {
			return <div key={index}>{file}</div>;
		});

		return (
			<div className="uploadbar">
				{this.props.header}
				<span className="message fadeIn">Uploading {progress}%</span>
				<ProgressBar active now={progress} />
				{currentFiles}
			</div>
		);
	}

// custom methods ---------------------------------------------------------


}

UploadProgress.propTypes = {
	progress: React.PropTypes.object,
	header:   React.PropTypes.object
};

UploadProgress.Props = {
	progress: {}
};