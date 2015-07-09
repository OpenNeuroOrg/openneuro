// dependencies -------------------------------------------------------

import React      from 'react'
import { Nav,DropdownButton, MenuItem, TabbedArea, TabPane, PanelGroup, Accordion, Panel } from 'react-bootstrap';

class Dashboard extends React.Component {

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
			<DropdownButton eventKey={4} title='filters' navItem={true}>
				<MenuItem eventKey='4.0'>By title</MenuItem>
			</DropdownButton>
		);
		let header =(
			<div className="header">
			<h4 className="dataset">fake header text</h4>
			<div className="date">6/10/15</div>
			</div>
		)
		let notificationsTab = <div>notifications</div>

		let datasetsTab = (
			<div className="dash-tab-content">
				<h2>Datasets</h2>
				<PanelGroup activeKey={this.state.activeKey} onSelect={this.handleSelect} accordion>
					<Panel header={header} eventKey='1'>Panel 1 content</Panel>
					<Panel header={header} eventKey='2'>Panel 2 content</Panel>
				</PanelGroup>
			</div>
		)

		let jobsTab = <div>jobs</div>
		return (
	
				<div className="fadeIn inner-route">
				<ul className="nav nav-pills dash-tab-link">
					<li className={this.state.notifications ? 'active' : null} onClick={this._notifications.bind(this)}><a>Notifications</a></li>
					<li className={this.state.datasets ? 'active' : null} onClick={this._datasets.bind(this)}><a>Datasets</a></li>
					<li className={this.state.jobs ? 'active' : null} onClick={this._jobs.bind(this)}><a>Jobs</a></li>
					{filters}
					<li><a href="#"><i className="fa fa-search"></i></a></li>
				</ul>
				<div>
				{this.state.notifications ? notificationsTab : null}
				{this.state.datasets ? datasetsTab : null}
				{this.state.jobs ? jobsTab : null}
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





