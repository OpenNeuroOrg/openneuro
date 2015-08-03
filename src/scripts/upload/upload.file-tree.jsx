// dependencies -------------------------------------------------------

import React     from 'react';
import fileUtils from '../utils/files';

class FileTree extends React.Component {

// life cycle events --------------------------------------------------

	render () {
		let self = this;
		let tree = this.props.tree ? this.props.tree : [];
		let nodes = tree.map(function (item, index) {
			return (
				<li key={index}>{item.name}
					<ul><FileTree tree={item.children} /></ul>
				</li>
			);
		});
		return (
			<ul>{nodes}</ul>
    	);
	}

}

export default FileTree;



