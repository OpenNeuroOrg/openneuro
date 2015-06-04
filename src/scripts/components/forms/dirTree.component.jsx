// dependencies -------------------------------------------------------

import React from 'react';

let DirTree = React.createClass({

// life cycle events --------------------------------------------------

	render: function () {
		let self = this;
		let tree = this.props.tree ? this.props.tree : [];
		let nodes = tree.map(function (item, index) {
			return (
					<li key={index} onClick={self._logFile.bind(null, item)}>{item.name}
						<ul><DirTree tree={item.children} /></ul>
					</li>
			);
		});
		return (
			<div>{nodes}</div>
    	);
	},

// custom methods -----------------------------------------------------
	
	_logFile (item, e) {
		e.stopPropagation();
		if (item.type !== 'folder') {
			var reader = new FileReader();
			reader.onloadend = function (evt) {
				if (evt.target.readyState == FileReader.DONE) {
					//console.log(evt);
					console.log(evt.target.result);
				}
			};
			reader.readAsBinaryString(item);
		}
	}

});

export default DirTree;



