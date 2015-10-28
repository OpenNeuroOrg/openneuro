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
					<li><Link to="notifications" className="btn-blue">Notifications<span className="unread-badge">2</span></Link></li>
					<li><Link to="datasets" className="btn-blue">My Datasets</Link></li>
					<li><Link to="jobs" className="btn-blue">My Results</Link></li>
				</ul>
				<div>
					<RouteHandler/>
				</div>
			</div>
    	);
	}

}

export default Dashboard;





