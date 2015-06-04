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
			<input type="file"  className="dirUpload-btn" onChange={self._onFileSelect} />
    	);
	},

// custom methods -----------------------------------------------------

	_onChange: function (e) {
		this.props.onChange(e);
	},

	_onFileSelect: function (e) {
		let files = e.target.files;

	/////////////////////////////////////////////////////////////////////
		var f = files[5];
		//console.log(f);
		var reader = new FileReader();
		reader.onloadend = function (evt) {
		//	if (evt.target.readyState == FileReader.DONE) {
				//console.log(evt);
				//console.log(evt.target.result);
		//	}
		};
		reader.readAsBinaryString(f);
	/////////////////////////////////////////////////////////////////////

		this.props.onChange(this._generateFileTree(files));
	},

	_generateFileTree: function (files) {
		let pathList = {};
		let dirTree = {};

        // generate list of paths
		for (let i = 0; i < files.length; i++) {
			let file = files[i];
            pathList[file.webkitRelativePath] = file;
        }

        // build path from list
        for (let key in pathList) {
        	let path = key;
        	let pathParts = path.split('/');
        	let subObj = dirTree;
        	for (let j = 0; j < pathParts.length; j++) {
        		let part = pathParts[j];
        		if (!subObj[part]) {
        			subObj[part] = j < pathParts.length - 1 ? {} : pathList[key];
        		}
        		subObj = subObj[part];
        	}
        }

		// convert dirTree to array structure
        function objToArr (obj) {
        	let arr = [];
        	for (let key in obj) {
        		if (obj[key].webkitRelativePath && obj[key].webkitRelativePath.length > 0) {
        			arr.push(obj[key]);
        		} else {
        			arr.push({name: key, type: 'folder', children: objToArr(obj[key])});
        		}
        	}
        	return arr;
		}

		dirTree = objToArr(dirTree);
		console.log(dirTree);

        // return tree
        return dirTree;
	}

});

export default Upload;