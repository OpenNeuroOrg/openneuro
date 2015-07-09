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
			<DropdownButton eventKey={4} title='filters' navItem={true} className="navbar-right">
				<MenuItem eventKey='4.0'>By title</MenuItem>
			</DropdownButton>
		);
		let datasetheader =(
			<div className="header clearfix">
				<h4 className="dataset">fake header text</h4>
				<div className="date">6/10/15</div>
			</div>
		)
		let notificatonheader =(
			<div className="header clearfix unread">
				<h4 className="dataset">fake header text</h4>
				<div className="date">6/10/15</div>
			</div>
		)
		let notificationsTab = (
			<div className="dash-tab-content notifications fadeIn">
				<h2>My Notifications</h2>
				<PanelGroup activeKey={this.state.activeKey} accordion>
					<Panel header={notificatonheader} eventKey='1'>
						<div className="inner">
							Panel 1 content<br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
						</div>
					</Panel>
					<Panel header={notificatonheader} eventKey='2'>
						<div className="inner">
							Panel 2 content<br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
						</div>
					</Panel>
				</PanelGroup>
			</div>
		)

		let datasetsTab = (
			<div className="dash-tab-content datasets fadeIn">
				<h2>My Datasets</h2>
				<PanelGroup activeKey={this.state.activeKey} accordion>
					<Panel header={datasetheader} eventKey='1'>
						<div className="inner">
							Panel 1 content<br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
						</div>
					</Panel>
					<Panel header={datasetheader} eventKey='2'>
						<div className="inner">
							Panel 2 content<br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
						</div>
					</Panel>
				</PanelGroup>
			</div>
		)

		let jobsTab = (
			<div className="dash-tab-content notifications fadeIn">
				<h2>My Jobs</h2>
			</div>
		);
		return (
	
				<div className="fadeIn inner-route dashboard">
				<ul className="nav nav-pills dash-tab-link">
					<li className={this.state.notifications ? 'active' : null} onClick={this._notifications.bind(this)}><a className="btn-blue">Notifications<span className="unread-badge">2</span></a></li>
					<li className={this.state.datasets ? 'active' : null} onClick={this._datasets.bind(this)}><a className="btn-blue">Datasets</a></li>
					<li className={this.state.jobs ? 'active' : null} onClick={this._jobs.bind(this)}><a className="btn-blue">Jobs</a></li>
					
					<li className="navbar-right"><a href="#"><i className="fa fa-refresh"></i></a></li>
					<li className="navbar-right"><a href="#"><i className="fa fa-search"></i></a></li>
					{filters}
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





