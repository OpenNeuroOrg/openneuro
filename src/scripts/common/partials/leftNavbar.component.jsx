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
			<span className={this.state.showNav ? 'closed' : null}>
				<span className="left-nav-slider">
					<ul>
						<li className="useradmin-upload">
							<Link to="dashboard"><i className="fa fa-dashboard" /> dashboard</Link>
						</li>
					</ul>
					<span onClick={this._toggleNav.bind(this)}>
						{this.state.showNav ? 'open »' : 'close «'}
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
