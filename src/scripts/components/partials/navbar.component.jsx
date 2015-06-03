// dependencies ------------------------------------------------------------------

import React from 'react';
import Reflux from 'reflux';
import { Link } from 'react-router';
import { Navbar, CollapsibleNav, Nav, NavItem, DropdownButton, MenuItem } from 'react-bootstrap';
import Actions from '../../actions/Actions';
import userStore from '../../stores/userStore';

let BSNavbar = React.createClass({

	mixins: [Reflux.connect(userStore)],

// life cycle methods ------------------------------------------------------------

	getInitialState () {

	},

	componentDidMount () {

	},

	render: function () {
		let self = this;
		let isLoggedIn = !!this.state.token;
		let brand = (
			<Link to="home" className="navbar-brand">
				<img src="./assets/CRN-Logo-Placeholder.png"
					 alt="Center for Reproducible Neuroscience Logo"
					 title="Center for Reproducible Neuroscience Link To Home Page"/>
			</Link>
		);
		let usermenu = (
			<DropdownButton className="user-menu" eventKey={1} title={<i className="fa fa-gear"> User Menu</i>}>
				<li><Link to="upload">upload</Link></li>
				<MenuItem divider />
				{isLoggedIn ? <li><a onClick={this._signOut}>Sign Out</a></li> : usermenu}
	        </DropdownButton>
		);
		return (
			<Navbar fixedTop brand={brand} toggleNavKey={0}>
				<CollapsibleNav eventKey={0}>
					<Nav navbar right>
						{isLoggedIn ? usermenu : <li><Link to="signIn">Sign In</Link></li>}
				    </Nav>
			    </CollapsibleNav>
			</Navbar>
	    );
	},

// custom methods ----------------------------------------------------------------

	//TODO - hide user menu when signed out. Replace User Menu Text with <profile name>

	_signOut: function (e) {
		Actions.signOut();
	}

});



export default BSNavbar;
