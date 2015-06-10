// dependencies -------------------------------------------------------

import React from 'react';
import fileUtils from '../../utils/files';

let Upload = React.createClass({

// life cycle events --------------------------------------------------

	componentDidMount: function () {
		this.getDOMNode().setAttribute('webkitdirectory', true);
		this.getDOMNode().setAttribute('directory', true);
	},

	render: function () {
		let self = this;
		return (
			<input type="file"  className="dirUpload-btn" onChange={self._onFileSelect} />
    	);
	},

// custom methods -----------------------------------------------------

	_onChange: function (e) {
		this.props.onChange(e);
	},

	_onFileSelect: function (e) {
		let files   = e.target.files;
        let dirTree = fileUtils.generateTree(files);
		this.props.onChange({tree: dirTree, list: files});
	}

});

export default Upload;