// dependencies ------------------------------------------------------------------

import React from 'react';
import { Link } from 'react-router';
import { Navbar, CollapsibleNav, Nav, NavItem, DropdownButton, MenuItem } from 'react-bootstrap';
import Actions from '../../actions/Actions';
import UserStore from '../../stores/userStore';

let BSNavbar = React.createClass({

// life cycle methods ------------------------------------------------------------

	render: function () {
		let self = this;
		let brand = (
			<Link to="/" className="navbar-brand">
				<img src="./assets/CRN-Logo-Placeholder.png"
					 alt="Center for Reproducible Neuroscience Logo"
					 title="Center for Reproducible Neuroscience Link To Home Page"/>
			</Link>
		);
		return (
		<Navbar fixedTop brand={brand} toggleNavKey={0}>
			<CollapsibleNav eventKey={0}>
				<Nav navbar right>
					<DropdownButton className="user-menu" eventKey={1} title={<i className="fa fa-gear"> User Menu</i>}>
						<MenuItem><Link to="upload">upload</Link></MenuItem>
						<MenuItem divider />
						<MenuItem><a onClick={this._signOut}>Sign Out</a></MenuItem>
			        </DropdownButton>
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
