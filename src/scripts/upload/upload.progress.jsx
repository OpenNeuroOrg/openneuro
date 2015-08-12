// dependencies -----------------------------------------------------------

import React from 'react';
import {ProgressBar} from 'react-bootstrap';

// component setup --------------------------------------------------------

export default class UploadProgress extends React.Component {

// life cycle events ------------------------------------------------------
	
	render () {
		let progress = this.props.progress.total > 0 ? Math.floor(this.props.progress.completed / this.props.progress.total * 100) : 0;

		let currentFiles = this.props.progress.currentFiles.map(function (file, index) {
			return (
				<div className="uploadFiles" key={index}>
					{file}
					<span className="one">.</span>
					<span className="two">.</span>
					<span className="three">.</span>​
				</div>
			);
		});

		return (
			<div className="uploadbar">
				<span>
					<label><i className="folderIcon fa fa-folder-open" /></label>
					{this.props.name}
				</span>
				<span className="message fadeIn">Uploading {progress}%</span>
				<ProgressBar active now={progress} />
				<div className="uploadFiles-wrap">
					{currentFiles}
				</div>
			</div>
		);
	}

// custom methods ---------------------------------------------------------


}

UploadProgress.propTypes = {
	progress: React.PropTypes.object,
	name:   React.PropTypes.string
};

UploadProgress.Props = {
	progress: {}
};