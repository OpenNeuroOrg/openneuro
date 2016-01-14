// dependencies --------------------------------------------------------------

import React        from 'react';
import Navbar       from './partials/navbar.jsx';
import Actions      from '../user/user.actions.js';
import Upload       from '../upload/upload.jsx';
import LeftNavbar   from './partials/left-navbar.jsx';
import mixin        from 'es6-react-mixins';
import UserStore    from '../user/user.store';
import bowser  		from 'bowser';
import Happybrowser from './partials/happybrowser.jsx';
import {RouteHandler, State} from 'react-router';

// component setup -----------------------------------------------------------

let App = React.createClass({

	mixins: [State],

// life cycle methods --------------------------------------------------------

	componentDidMount () {
		Actions.initOAuth();
	},

	render () {
		let showLeftNav 	= !this.isActive('signIn');
		let is_front 		= this.isActive('signIn');
		let close 			= <span><span className="sr-only">Close</span> »</span>;
		let open 			= <span><span className="sr-only">Open</span> «</span>;
		let sidebar;
		let leftnav;
		let toggleSidebar;

		if (showLeftNav) {
			leftnav = <div className="left-nav"><LeftNavbar /></div>
		}

		return (
			<div className={is_front ? "page is-front" : "page"}>
				{!bowser.chrome ?  <Happybrowser /> : null }
				<div className="full-col">
					<Navbar/>
					<div className="main view container">
						<div className={showLeftNav ? "route-wrapper" : null}>
							{leftnav}
							<RouteHandler/>
						</div>
					</div>
				</div>
				{toggleSidebar}
				{sidebar}
			</div>
		);
	},

// custom methods ------------------------------------------------------------

	_toggleSidebar () {
		this.setState({
			toggleSidebarbar: !this.state.toggleSidebarbar
		})
	}

});

export default App;