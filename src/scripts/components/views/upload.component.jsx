// dependencies -------------------------------------------------------

import React from 'react'
import DirUpload from'../forms/dirUpload.component.jsx';
import DirTree from'../forms/dirTree.component.jsx';

var Upload = React.createClass({

// life cycle events --------------------------------------------------

	getInitialState: function () {
		return {
			tree: []
		};
	},

	render: function () {
		let self = this;
		let tree = this.state.tree;
		return (
			<div>
				<DirUpload onChange={self._onChange} />
				<DirTree tree={tree}/>
			</div>
    	);
		
	},

// custom methods -----------------------------------------------------

	_onChange (directory) {
		this.setState({tree: directory})
	}

});

export default Upload;