// dependencies ------------------------------------------------------------------

import React     from 'react';
import Reflux    from 'reflux';
import {Link} 	 from 'react-router';
import userStore from '../../user/user.store.js';


// component setup ---------------------------------------------------------------

let LeftNavbar = React.createClass({

	mixins: [Reflux.connect(userStore)],

	componentWillReceiveProps () {
		this.setState({showNav: false});
	},

// life cycle methods ------------------------------------------------------------

	render () {
		let adminLink = <Link to="admin"><i className="fa fa-lock" /><span className="link-name">admin</span></Link>;

		return (
			<span className={this.state.showNav ? 'open' : null}>
				<span className="left-nav-slider">
					<ul>
						<li className="left-nav-dashboard">
							<Link to="dashboard"><i className="fa fa-dashboard" /><span className="link-name">dashboard</span></Link>
							{this.state.scitran && this.state.scitran.wheel ? adminLink : null }
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
