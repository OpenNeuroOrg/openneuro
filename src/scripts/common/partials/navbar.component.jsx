// dependencies ------------------------------------------------------------------

import React from 'react';
import Reflux from 'reflux';
import { Link, Navigation } from 'react-router';
import { Navbar, CollapsibleNav, Nav, NavItem, DropdownButton, MenuItem } from 'react-bootstrap';
import Actions   from '../../user/user.actions.js';
import userStore from '../../user/user.store.js';

// component setup ---------------------------------------------------------------

let BSNavbar = React.createClass({

	mixins: [Reflux.connect(userStore), Navigation],

// life cycle methods ------------------------------------------------------------
	render: function () {
		let self = this;
		let isLoggedIn = !!this.state.token;
		let username = this.state.user ? this.state.user.displayName : 'user-menu';
		let thumbnail = this.state.user ? this.state.user.thumbnail : null;
		let email = this.state.user ? this.state.user.email : null;
		if (this.state.user) {
			let gear = (<i className="fa fa-gear" />);
			var usermenu = (
				<span>
					<img src={thumbnail} alt={username} className="userImgThumb" /> 
					<DropdownButton className="user-menu btn-null" eventKey={1} title={gear}>
						<li role="presentation" className="dropdown-header">{username}</li>
						<li role="presentation" className="dropdown-header">{email}</li>
						<li><a onClick={this._signOut} className="btn-basic">Sign Out</a></li>
						<li className="useradmin-upload"><Link to="upload"><i className="fa fa-upload" /> Upload</Link></li>
			        </DropdownButton>
		        </span>
			);
		}

		let brand = (
			<Link to="home" className="navbar-brand">
				<img src="./assets/CRN-Logo-Placeholder.png"
					 alt="Center for Reproducible Neuroscience Logo"
					 title="Center for Reproducible Neuroscience Link To Home Page"/>
			</Link>
		);

		return (
			<Navbar fixedTop brand={brand} toggleNavKey={0}>
				<CollapsibleNav eventKey={0}>
					<Nav navbar right className="useradmin-nav">
						{isLoggedIn ? usermenu : <li><Link to="signIn">Sign In</Link></li>}
				    </Nav>
			    </CollapsibleNav>
			</Navbar>
	    );
	},

// custom methods ----------------------------------------------------------------

	_signOut: function () {
		Actions.signOut(this.transitionTo);
	}

});



export default BSNavbar;
