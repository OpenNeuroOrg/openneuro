// dependencies -------------------------------------------------------

import React from 'react';
import fileUtils from '../utils/files';

class Upload extends React.Component {

// life cycle events --------------------------------------------------

	componentDidMount () {
		React.findDOMNode(this).setAttribute('webkitdirectory', true);
		React.findDOMNode(this).setAttribute('directory', true);
	}

	render () {
		return (
			<input type="file"  className="dirUpload-btn" onChange={this._onFileSelect.bind(this)} ref="fileSelect"/>
    	);
	}

// custom methods -----------------------------------------------------

	_clearInput () {
		this.refs.fileSelect.getDOMNode().value = null;
	}

	_onFileSelect (e) {
		if (e.target) {
			let files   = e.target.files;
	        let dirTree = fileUtils.generateTree(files);
			this.props.onChange({tree: dirTree, list: files});
		}
		this._clearInput();
	}

}

export default Upload;