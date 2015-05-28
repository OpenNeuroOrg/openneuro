import React from 'react'
import request from 'superagent'

import FS_upload from'../forms/fs_upload.component.jsx'

var Upload = React.createClass({
	render: function () {
		return (
			<FS_upload />
    	);
		
	},
	handleSubmit: function () {
		// var url = 'http://www.reddit.com/.json';
		// request.get(url, function (res) {
		// 	console.log(res);
		// });
	}
});

export default Upload;