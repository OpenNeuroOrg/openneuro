// dependencies ------------------------------------------------------------------

import React       		from 'react';
import Reflux      		from 'reflux';
import {Link}      		from 'react-router';
import Actions     		from '../../user/user.actions.js';
import userStore   		from '../../user/user.store.js';
import uploadStore 		from '../../upload/upload.store.js';
import Upload       	from '../../upload/upload.jsx';
import {CollapsibleNav, 
		Nav, 
		DropdownButton, 
		Modal} 			from 'react-bootstrap';

// component setup ---------------------------------------------------------------

let BSNavbar = React.createClass({

	mixins: [Reflux.connect(userStore)],

// life cycle methods ------------------------------------------------------------

	render: function () {
		let self = this;
		let isLoggedIn = !!this.state.token;

		//generate user menu
		let usermenu, thumbnail, uploadBtn, uploadModal; 
		if (this.state.google) {

			let username = this.state.google.displayName;
			let email   = this.state.google.email;
			
			
			/*uploadDataset = (
				<div className="col-xs-4 tasks-col fadeIn no-chrome">
					<div className="no-chrome-overlay">Uploading the file structure of a <a className="message" href="http://bids.neuroimaging.io/" target="_blank">BIDS dataset</a> requires Chrome. Please switch your browser to use this feature.</div>
					<Upload />
				</div>
				);*/
			
			let uploadDataset = <div className="tasks-col fadeIn"><Upload /></div>
			uploadBtn = <button className="btn btn-blue"  onClick={Actions.toggleModal.bind(null, 'Upload')}>Upload Dataset</button>;
			
			uploadModal = (
	            <Modal show={this.state.showUploadModal} onHide={Actions.toggleModal.bind(null, 'Upload')} className="upload-modal">
	            	<Modal.Header closeButton>
	            		<Modal.Title>Share Dataset</Modal.Title>
	            	</Modal.Header>
	            	<hr className="modal-inner" />
	            	<Modal.Body>
	            		{uploadDataset}
	            	</Modal.Body>
	            </Modal>
	        );

			if (this.state.google.picture) {
				thumbnail = this.state.google.picture.replace("sz=50", "sz=200");
			}

			let gear = (<i className="fa fa-gear" />);
			usermenu = (
				<Nav navbar right className="useradmin-nav">
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
							<li><a onClick={this._signOut} className="um-sign-out">Sign Out</a></li>
							<li role="separator" className="divider"></li>
							{/* styled dropdown icons ==== <li className="um-icon"><Link to="dashboard"><i className="fa fa-search" /></Link></li>*/}
				        </DropdownButton>
			        </span>
		        </Nav>
			);
		}

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
				    <CollapsibleNav eventKey={0}>
							<Nav navbar className="useradmin-nav">
								{isLoggedIn ? uploadBtn : null}
								{isLoggedIn ? uploadModal : null}
						    </Nav>
						    {isLoggedIn ? usermenu : null}
					</CollapsibleNav>
				</div>
		    </nav>
	    );
	},

// custom methods ----------------------------------------------------------------

	_signOut: function () {
		Actions.signOut(uploadStore.data.uploadStatus);
	}

});



export default BSNavbar;
