// dependencies --------------------------------------------------------------

import React from 'react';
import {RouteHandler, State} from 'react-router';
import Navbar from './partials/navbar.component.jsx';
import Actions from '../user/user.actions.js';
import Upload from '../upload/upload.component.jsx';
import LeftNavbar from './partials/leftNavbar.component.jsx';
import mixin from 'es6-react-mixins';
import bowser  		 from 'bowser';
import Happybrowser  from './partials/happybrowser.jsx';
// component setup -----------------------------------------------------------

var App = React.createClass({

	mixins: [State],

// life cycle methods --------------------------------------------------------

	componentDidMount () {
		Actions.initOAuth();
	},

	render () {
		let showUpload = this.isActive('dashboard');
		let showLeftNav = !this.isActive('signIn');
		let sidebar;
		let leftnav;
		let sidebarNoChrome;

		if(!bowser.chrome){
			sidebarNoChrome = <div className="no-chrome-overlay">Chrome only feature</div>;
		}

		if (showUpload) {
			sidebar = <div className="col-xs-4 tasks-col fadeIn">{sidebarNoChrome}<Upload /></div>;
		}

		if (showLeftNav) {
			leftnav = <div className="left-nav"><LeftNavbar /></div>
		}

		return (
			<div className="page">
				{!bowser.chrome ?  <Happybrowser /> : null }
				<div className={showUpload ? 'col-xs-8 main-col' : 'full-col'}>
					<Navbar/>
					<div className="main view container">
						<div className="col-xs-12 route-wrapper">
							{leftnav}
							<RouteHandler/>
						</div>
					</div>
				</div>
				{sidebar}
			</div> 
		)				
	}

});

export default App;