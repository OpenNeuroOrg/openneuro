// dependencies --------------------------------------------------------------

import React        from 'react';
import Navbar       from './partials/navbar.component.jsx';
import Actions      from '../user/user.actions.js';
import Upload       from '../upload/upload.component.jsx';
import LeftNavbar   from './partials/leftNavbar.component.jsx';
import mixin        from 'es6-react-mixins';
import UserStore    from '../user/user.store';
import bowser  		from 'bowser';
import Happybrowser from './partials/happybrowser.jsx';
import {RouteHandler, State} from 'react-router';

// component setup -----------------------------------------------------------

let App = React.createClass({

	mixins: [State],

// life cycle methods --------------------------------------------------------
	
	getInitialState() {
		return {toggleSidebarbar: true};
	},

	componentDidMount () {
		Actions.initOAuth();
	},

	render () {
		let showUpload 		= UserStore.hasToken() && this.state.toggleSidebarbar;
		let showLeftNav 	= !this.isActive('signIn');
		let is_front 		= this.isActive('signIn');
		let close 			= <span><span className="sr-only">Close</span> »</span>;
		let open 			= <span><span className="sr-only">Open</span> «</span>;
		let sidebar;
		let leftnav;
		let sidebarNoChrome;
		let toggleSidebar;

		if (UserStore.hasToken()){
			toggleSidebar = (
				<div className={this.state.toggleSidebarbar ? "open toggle-sidebar-wrap" : "toggle-sidebar-wrap"}>
					<button title="toggle sidebar" className="btn" aria-label="toggle sidebar" onClick={this._toggleSidebar}>{this.state.toggleSidebarbar ? close : open}</button>
				</div>
			);
		}

		if(!bowser.chrome){
			sidebarNoChrome = <div className="no-chrome-overlay">Uploading the file structure of a BIDS datasets requires Chrome. Please switch browsers to use this feature</div>;
		}

		if (showUpload) {
			sidebar = <div className="col-xs-4 tasks-col fadeIn">{sidebarNoChrome}<Upload /></div>
		}

		if (showLeftNav) {
			leftnav = <div className="left-nav"><LeftNavbar /></div>
		}

		return (
			<div className={is_front ? "page is-front" : "page"}>
				{!bowser.chrome ?  <Happybrowser /> : null }
				<div className={showUpload ? 'col-xs-8 main-col' : 'full-col'}>
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
		)				
	},

// custom methods ------------------------------------------------------------

	_toggleSidebar () {
		this.setState({
			toggleSidebarbar: !this.state.toggleSidebarbar
		})
	}

});

export default App;