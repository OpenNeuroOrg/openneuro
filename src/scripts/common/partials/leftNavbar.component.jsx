// dependencies ------------------------------------------------------------------

import React 		from 'react';
import {Link} 		from 'react-router';
import userStore   	from '../../user/user.store.js';


// component setup ---------------------------------------------------------------

class LeftNavbar extends React.Component {

	constructor (props) {
		super(props);
		this.state = {showNav: false};
	}

	componentWillReceiveProps () {
		this.setState({showNav: false});
	}

// life cycle methods ------------------------------------------------------------

	render () {
		let adminLink =(
			<Link to="admin"><i className="fa fa-lock" /><span className="link-name">admin</span></Link>
		);
		return (
			<span className={this.state.showNav ? 'open' : null}>
				<span className="left-nav-slider">
					<ul>
						<li className="left-nav-dashboard">
							<Link to="dashboard"><i className="fa fa-dashboard" /><span className="link-name">dashboard</span></Link>
							{ userStore.data.scitran.wheel ? adminLink : null }
						</li>
					</ul>
					<span className="show-nav-btn" onClick={this._toggleNav.bind(this)}>
						{this.state.showNav ?  'close «' : 'open »'}
					</span>
				</span>
			</span>
	    )
	}

// custom methods ----------------------------------------------------------------
	
	_toggleNav () {
		this.setState({showNav: !this.state.showNav});
	}

}

export default LeftNavbar;
