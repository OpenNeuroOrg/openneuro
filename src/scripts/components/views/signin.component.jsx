import React from 'react'
import request from 'superagent'

import Text from'../forms/text.component.jsx'
import Password from'../forms/password.component.jsx'
import LoadButton from'../forms/load-button.component.jsx'

var Signin = React.createClass({
	render: function () {
		return (
			<form>
				<h2 class="">Sign in with Google</h2>
	    		<LoadButton text=""  faIcon="fa-google" />
			</form>
    	);
		
	},
	handleSubmit: function () {
		// var url = 'http://www.reddit.com/.json';
		// request.get(url, function (res) {
		// 	console.log(res);
		// });
	}
});

export default Signin;