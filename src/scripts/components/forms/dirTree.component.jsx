// dependencies -------------------------------------------------------

import React from 'react';

let DirTree = React.createClass({

// life cycle events --------------------------------------------------

	render: function () {
		let self = this;
		let tree = this.props.tree ? this.props.tree : [];
		let nodes = tree.map(function (item, index) {
			return (
				<li key={index} >{item.name}
					<ul><DirTree tree={item.children} /></ul>
				</li>
			);
		});
		return (
			<div>{nodes}</div>
    	);
	},

// custom methods -----------------------------------------------------

});

export default DirTree;