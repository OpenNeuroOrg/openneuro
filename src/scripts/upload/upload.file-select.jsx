// dependencies -------------------------------------------------------

import React     from 'react';
import fileUtils from '../utils/files';
import Actions   from './upload.store';

class Upload extends React.Component {

// life cycle events --------------------------------------------------

	componentDidMount () {
		React.findDOMNode(this).setAttribute('webkitdirectory', true);
		React.findDOMNode(this).setAttribute('directory', true);
		Actions.setRefs(this.refs);
	}

	render () {
		return (
			<input type="file"  className="dirUpload-btn" onClick={this._clearInput.bind(this)} onChange={this._onFileSelect.bind(this)} ref="fileSelect"/>
    	);
	}

// custom methods -----------------------------------------------------

	_clearInput () {
		React.findDOMNode(this.refs.fileSelect).value = null;
		Actions.setInitialState();
	}

	_onFileSelect (e) {
		if (e.target && e.target.files.length > 0) {
			let files   = e.target.files;
	        let dirTree = fileUtils.generateTree(files);
	        let results = {tree: dirTree, list: files};
			this.props.onChange(results);
		}
	}

}

export default Upload;