// dependencies ------------------------------------------------------------------

import React     from 'react';
import Reflux    from 'reflux';
import {Link}    from 'react-router';
import Actions   from '../../user/user.actions.js';
import userStore from '../../user/user.store.js';
import {CollapsibleNav, Nav, DropdownButton} from 'react-bootstrap';

// component setup ---------------------------------------------------------------

let BSNavbar = React.createClass({

	mixins: [Reflux.connect(userStore)],

// life cycle methods ------------------------------------------------------------

	render: function () {
		let self = this;
		let isLoggedIn = !!this.state.token;
		let username = this.state.user ? this.state.user.displayName : 'user-menu';
		let thumbnail = this.state.user ? this.state.user.picture : null;
		let email = this.state.user ? this.state.user.email : null;
		if (this.state.user) {
			let gear = (<i className="fa fa-gear" />);
			var usermenu = (
				<span>
					<span className="username">
						<span className="greeting">Hello</span> 
						<br/>
						{username}
					</span>
					<img src={thumbnail} alt={username} className="userImgThumb" /> 
					<DropdownButton className="user-menu btn-null" eventKey={1} title={gear}>
						<img src={thumbnail} alt={username} className="userMenuThumb" /> 
						<li role="presentation" className="dropdown-header">{username}</li>
						<li role="separator" className="divider"></li>
						<li><a onClick={this._signOut} className="sign-out">Sign Out</a></li>
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
			<nav role="navigation" className="navbar navbar-default" toggleNavKey={0}>
				<div className="container">
					<div className="navbar-header">
						{brand}
				    </div>
				    <CollapsibleNav eventKey={0}>
							<Nav navbar right className="useradmin-nav">
								{isLoggedIn ? usermenu : <li><Link className="sign-in" to="signIn">Sign In</Link></li>}
						    </Nav>
					</CollapsibleNav>
				</div>
		    </nav>
	    );
	},

// custom methods ----------------------------------------------------------------

	_signOut: function () {
		Actions.signOut();
	}

});



export default BSNavbar;
