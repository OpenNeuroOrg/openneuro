// dependencies -------------------------------------------------------

import React      from 'react'
import {Link} from 'react-router';
import {RouteHandler, State} from 'react-router';
import { Nav,DropdownButton, MenuItem, TabbedArea, TabPane, PanelGroup, Accordion, Panel } from 'react-bootstrap';

class Dashboard extends React.Component {
	mixins: [State]

// life cycle events --------------------------------------------------

	constructor (props) {
		super(props);
		this.state = {
			notifications: true,
			datasets: false,
			jobs: false
		};
	}

	render () {
		// Alert bsStyle: danger, warning, success, info
		let filters = (
			<DropdownButton eventKey={4} title='filters' navItem={true} className="navbar-right">
				<MenuItem eventKey='4.0'>By title</MenuItem>
			</DropdownButton>
		);


		return (
	
				<div className="fadeIn inner-route dashboard">
				<ul className="nav nav-pills dash-tab-link">
					<li><Link to="notifications" className="btn-blue">Notifications<span className="unread-badge">2</span></Link></li>
					<li><Link to="datasets" className="btn-blue">My Datasets</Link></li>
					<li><Link to="jobs" className="btn-blue">My Results</Link></li>
					
					<li className="navbar-right"><a href="#"><i className="fa fa-refresh"></i></a></li>
					<li className="navbar-right"><a href="#"><i className="fa fa-search"></i></a></li>
					{filters}
				</ul>
				<div>
				<RouteHandler/>
				</div>
				</div>
		
    	);
	
	};

// custom methods -----------------------------------------------------
	_notifications () {
		this.setState({
			notifications: true,
			datasets: false,
			jobs: false
		});
	};
	_datasets () {
		this.setState({
			notifications: false,
			datasets: true,
			jobs: false
		});
	};
	_jobs () {
		this.setState({
			notifications: false,
			datasets: false,
			jobs: true
		});
	};

}

export default Dashboard;





