// dependencies ------------------------------------------------------------------

import React       		from 'react';
import Reflux      		from 'reflux';
import {Link}      		from 'react-router';
import Usermenu         from './navbar.usermenu.jsx';
import UploadBtn        from './navbar.upload-button.jsx';
import userStore   		from '../user/user.store.js';
import uploadStore 		from '../upload/upload.store.js';
import Upload       	from '../upload/upload.jsx';
import Progress       	from '../upload/upload.progress.jsx';
import userActions   	from '../user/user.actions.js';
import Alert            from '../notification/notification.alert.jsx';
import {CollapsibleNav,
		Nav,
		DropdownButton,
		Modal} 			from 'react-bootstrap';

// component setup ---------------------------------------------------------------

let BSNavbar = React.createClass({

	mixins: [Reflux.connect(userStore)],

// life cycle methods ------------------------------------------------------------

	render: function () {
		let isLoggedIn = !!this.state.token;

		//generate user menu
		let usermenu, uploadBtn, uploadModal;
		if (this.state.google) {
			usermenu = (
				<Nav navbar right className="useradmin-nav clearfix">
					<div className="clearfix">
						<UploadBtn />
						<Usermenu />
			        </div>
		        </Nav>
			);
		}
		let signInGoogle = (
			<div className="navbar-right signInNavBtn">
				<button className="btn-blue" onClick={userActions.signIn.bind(null, {transition: false})} >
					<i className="fa fa-google" />
					<span> Sign in</span>
				</button>
			</div>
		);

		// generate brand
		let brand = (
			<Link to="dashboard" className="navbar-brand">
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
				    <CollapsibleNav className="clearfix" eventKey={0}>
						    {isLoggedIn ? usermenu : signInGoogle}
					</CollapsibleNav>
				</div>
				<Alert/>
		    </nav>
	    );
	},

// custom methods ----------------------------------------------------------------

});



export default BSNavbar;
