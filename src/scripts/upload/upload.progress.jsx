// dependencies -----------------------------------------------------------

import React from 'react';
import Reflux      from 'reflux';
import UploadStore from './upload.store.js';
import {ProgressBar} from 'react-bootstrap';

// component setup --------------------------------------------------------

let uploadProgress = React.createClass({

	mixins: [Reflux.connect(UploadStore)],

// life cycle events ------------------------------------------------------

	render () {
		let completed = this.state.progress.completed;
		let total     = this.state.progress.total;
		let progress  = total > 0 ? Math.floor(completed / total * 100) : 0;

		let currentFiles = this.state.progress.currentFiles.map(function (file, index) {
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
			<div className="uploadProgress-block">
				<span className="upload-dirname">
					<label><i className="folderIcon fa fa-folder-open" /></label>
					{this.state.dirName}
					<span className="message fadeIn"> {completed}/{total} files complete</span>

				</span>
				<ProgressBar active now={progress} />
				<div className="uploadFiles-wrap">
					{currentFiles}
				</div>
			</div>
		);
	},

// custom methods ---------------------------------------------------------


});

export default uploadProgress;

// UploadProgress.propTypes = {
// 	progress: React.PropTypes.object,
// 	name:   React.PropTypes.string
// };

// UploadProgress.Props = {
// 	progress: {}
// };