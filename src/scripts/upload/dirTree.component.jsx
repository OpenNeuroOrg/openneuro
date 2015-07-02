// dependencies -------------------------------------------------------

import React     from 'react';
import fileUtils from '../utils/files';

class DirTree extends React.Component {

// life cycle events --------------------------------------------------

	render () {
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
	}

// custom methods -----------------------------------------------------
	
	_logFile (item, e) {
		e.stopPropagation();
		if (item.type !== 'folder') {
			fileUtils.read(item, function (res) {
				console.log(res);
			});
		}
	}

}

export default DirTree;



