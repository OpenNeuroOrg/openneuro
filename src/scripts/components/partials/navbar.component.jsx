// dependencies -------------------------------------------------------
import React from 'react';
import Router from 'react-router'

import Navbar from 'react-bootstrap/lib/Navbar';
import CollapsibleNav from 'react-bootstrap/lib/CollapsibleNav';
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';


import Actions from '../../actions/Actions';
import UserStore from '../../stores/userStore';


let Link = Router.Link;

// ------------------------------------------------------------


// TODO - fix <Link /> Router props... ??

let BSNavbar = React.createClass({
	render: function () {
		let self = this;
		return (
		<Navbar fixedTop brand={<Link to="/" className="navbar-brand"><img src="./assets/CRN-Logo-Placeholder.png" alt="Center for Reproducible Neuroscience Logo" title="Center for Reproducible Neuroscience Link To Home Page"/></Link>} toggleNavKey={0}>
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

// custom methods -----------------------------------------------------

//TODO - hide user menu when signed out. Replace User Menu Text with <profile name>

	_signOut: function (e) {
		Actions.signOut();
	}

});



export default BSNavbar;
