// dependencies -------------------------------------------------------

import React   from 'react';
import actions from './dataset.actions.js';
import Spinner from '../common/partials/spinner.jsx';

export default class JobMenu extends React.Component {

// life cycle events --------------------------------------------------

	constructor() {
		super();
		this.state = {
			loading: false,
			selectedApp: ''
		};
	}

	render() {

		let options = this.props.apps.map((app) => {
			return <option key={app.id} value={app.id}>{app.label}</option>;
		});

		let form = (
			<div>
				<h5>Choose an analysis pipeline to run on dataset {this.props.dataset.name}</h5>
				<div className="text-danger">{this.state.error}</div>
				<select value={this.state.selectedApp} onChange={this._selectApp.bind(this)}>
					<option value="" disabled>Select a Task</option>
					{options}
				</select>
				<button className="btn-admin admin-blue" onClick={this._startJob.bind(this)}>Start</button>
			</div>
		);

		return (
			<div className="dataset">
				{this.state.loading ? <Spinner active={true} text={'Starting ' + this.state.selectedApp}/> : form}
			</div>
    	);
	}

// custom methods -----------------------------------------------------

	_selectApp(e) {
		this.setState({selectedApp: e.target.value});
	}

	_startJob() {
		this.setState({loading: true});
		actions.startJob('test', this.state.selectedApp, (err, res) => {
			this.setState({loading: false});
		});
	}
}