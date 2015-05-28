// dependencies -------------------------------------------------------

import React from 'react';

let Upload = React.createClass({

// life cycle events --------------------------------------------------

	componentDidMount: function () {
		this.getDOMNode().setAttribute('webkitdirectory', true);
		this.getDOMNode().setAttribute('directory', true);
	},

	render: function () {
		let self = this;
		return (
			<input type="file" onChange={self._onFileSelect} />
    	);
	},

// custom methods -----------------------------------------------------

	_onChange: function (e) {
		this.props.onChange(e);
	},

	_onFileSelect: function (e) {
		let files = e.target.files;
		this.props.onChange(this._generateFileTree(files));
	},

	_generateFileTree: function (files) {
		let pathList = [];
		var dirTree  = {};

		// generate list of paths
		for (let i = 0; i < files.length; i++) {
			let file = files[i];
            pathList.push(file.webkitRelativePath);
        }

        // build path from list
        for (let i = 0; i < pathList.length; i++) {
        	let path = pathList[i];
        	let pathParts = path.split('/');
        	var subObj = dirTree;
        	for (let j = 0; j < pathParts.length; j++) {
        		let part = pathParts[j];
        		if (!subObj[part]) {
        			subObj[part] = j < pathParts.length - 1 ? {} : path;
        		}
        		subObj = subObj[part];
        	}
        }

        // convert dirTree to array structure
        function objToArr (obj) {
			var arr = [];
			for (let key in obj) {
				if (typeof obj[key] != 'object') {
					arr.push({name: key, type: 'file', path: obj[key]})
				} else {
					arr.push({name: key, type: 'folder', children: objToArr(obj[key])});
				}
			}
			return arr;
		}

		dirTree = objToArr(dirTree);

        // return tree
        return dirTree;
	}

});

export default Upload;