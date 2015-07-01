// dependencies --------------------------------------------------------------

import React from 'react';
import {RouteHandler, State} from 'react-router';
import Navbar from './partials/navbar.component.jsx';
import LeftNavbar from './partials/leftNavbar.component.jsx';
import Actions from '../user/user.actions.js';
import Upload from '../upload/upload.component.jsx';
import mixin from 'es6-react-mixins';

// component setup -----------------------------------------------------------


var App = React.createClass({

	mixins: [State],

// life cycle methods --------------------------------------------------------

	componentDidMount () {
		Actions.initOAuth();
	},


	render () {
		let isActive = this.isActive("dashboard");
		let NoUploadSidebar = (
				<div className="full-col">
					<Navbar/>
					<RouteHandler />
				</div>
		);
		let UploadSidebar = (
			<span>
				<div className="col-xs-8 main-col">
					<Navbar/>
					<RouteHandler/>
				</div>
				<div className="col-xs-4 tools-col">
					<Upload />
				</div>
			</span>
		);
		return (
			<div className="page">
			{isActive ? UploadSidebar : NoUploadSidebar}
			</div> 
		)				
	}
});

export default App;
