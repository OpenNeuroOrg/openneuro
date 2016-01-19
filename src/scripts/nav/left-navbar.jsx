// dependencies ------------------------------------------------------------------

import React     from 'react';
import Reflux    from 'reflux';
import {Link} 	 from 'react-router';
import userStore from '../user/user.store.js';


// component setup ---------------------------------------------------------------

let LeftNavbar = React.createClass({

	mixins: [Reflux.connect(userStore)],

	componentWillReceiveProps () {
		this.setState({showNav: false});
	},

// life cycle methods ------------------------------------------------------------

	render () {
		let adminLink     = <Link to="admin"><i className="fa fa-lock" /><span className="link-name">admin</span></Link>;
		let dashboardLink = <Link to="dashboard"><i className="fa fa-dashboard" /><span className="link-name">dashboard</span></Link>;

		return (
			<span className={this.state.showNav ? 'open' : null}>
				<span className="left-nav-slider">
					<ul>
						<li className="left-nav-dashboard">
							{userStore.hasToken() ? dashboardLink : null}
							{this.state.scitran && this.state.scitran.root ? adminLink : null }
							<Link to="public"><i className="fa fa-globe" /><span className="link-name">Browse Publicly</span></Link>
							<a  href="mailto:openfmri@gmail.com?subject=Center%20for%20Reproducible%20Neuroscience%20Contact" target="_blank"><i className="fa fa-envelope-o" /><span className="link-name">contact</span></a>
						</li>
					</ul>
					<span className="show-nav-btn" onClick={this._toggleNav}>
						{this.state.showNav ?  'close «' : 'open »'}
					</span>
				</span>
			</span>
	    )
	},

// custom methods ----------------------------------------------------------------

	_toggleNav () {
		this.setState({showNav: !this.state.showNav});
	}

});

export default LeftNavbar;
