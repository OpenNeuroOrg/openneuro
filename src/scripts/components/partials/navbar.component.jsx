import React from 'react';

let Navbar = React.createClass({
	render: function () {
		let self = this;
		let Link = this.props.link;
		//todo add toggler js for nav-collapse
		return (
			<nav className="navbar navbar-default navbar-fixed-top">
				<div className="container">
					<div className="navbar-header">
						<button type="button" className="navbar-toggle collapsed" data-toggle="collapse">
						<span className="sr-only">Toggle navigation</span>
						<span className="icon-bar"></span>
						<span className="icon-bar"></span>
						<span className="icon-bar"></span>
						</button>
						<Link to="home" className="navbar-brand"><img src="./assets/CRN-Logo-Placeholder.png" alt="Center for Reproducible Neuroscience Logo" title="Center for Reproducible Neuroscience Link To Home Page"/></Link>
					</div>
					<div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
						<ul className="nav navbar-nav">
							<li><Link to="signIn">sign in</Link></li>
							<li><Link to="upload">upload</Link></li>
						</ul>
					</div>
				</div>
			</nav>
	    );
	}

});

export default Navbar;