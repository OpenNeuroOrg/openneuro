import React from 'react'
import request from 'superagent'

import ReactDropzone from'../forms/dropzone.jsx'

var Addfiles = React.createClass({
	render: function () {
		return (
			<ReactDropzone />
    	);
		
	},
	handleSubmit: function () {
		// var url = 'http://www.reddit.com/.json';
		// request.get(url, function (res) {
		// 	console.log(res);
		// });
	}
});

export default Addfiles;