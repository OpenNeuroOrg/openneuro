// dependencies ------------------------------------------------------------------

import React from 'react';
import {Link} from 'react-router';

// component setup ---------------------------------------------------------------

class LeftNavbar extends React.Component {

	constructor (props) {
		super(props);
		this.state = {showNav: false};
	}

// life cycle methods ------------------------------------------------------------

	render () {
		return (
			<span className={this.state.showNav ? 'open' : null}>
				<span className="left-nav-slider">
					<ul>
						<li className="left-nav-dashboard">
							<Link to="dashboard"><i className="fa fa-dashboard" /><span className="link-name">dashboard</span></Link>
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
