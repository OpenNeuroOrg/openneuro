// dependencies -------------------------------------------------------

import React from 'react';

let Upload = React.createClass({

// life cycle events --------------------------------------------------

	componentDidMount: function () {
		this.getDOMNode().setAttribute('webkitdirectory', true);
		this.getDOMNode().setAttribute('directory', true);
	},

	render: function () {
		return (
			<input type="file" />
    	);
		
	},

// custom methods -----------------------------------------------------

	_upload: function () {
		
	}

});

export default Upload;