// dependencies --------------------------------------------------------------

import React from 'react';
import {RouteHandler, State} from 'react-router';
import Navbar from './partials/navbar.component.jsx';
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
		let showSidebar = this.isActive('dashboard');
		let sidebar;

		if (showSidebar) {
			sidebar = <div className="col-xs-4 tools-col"><Upload /></div>;
		}

		return (
			<div className="page">
				<div className={showSidebar ? 'col-xs-8 main-col' : 'full-col'}>
					<Navbar/>
					<RouteHandler/>
				</div>
				{sidebar}
			</div> 
		)				
	}

});

export default App;