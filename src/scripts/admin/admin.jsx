// dependencies -------------------------------------------------------

import React                      from 'react';
import {RouteHandler, Link}       from 'react-router';
import {DropdownButton, MenuItem} from 'react-bootstrap';


class Dashboard extends React.Component {

// life cycle events --------------------------------------------------

	render () {
		return (
			<div className="fadeIn inner-route dashboard">
				<ul className="nav nav-pills dash-tab-link">
					<li><Link to="users" className="btn-blue">Users</Link></li>
					<li><Link to="blacklist" className="btn-blue">Blacklist</Link></li>
				</ul>
				<div>
					<RouteHandler/>
				</div>
			</div>
    	);
	}

}

export default Dashboard;





