// dependencies -------------------------------------------------------

import React      from 'react';
import Actions    from './dataset.actions.js';
import crn        from '../utils/crn';

export default class Share extends React.Component {

// life cycle events --------------------------------------------------

	constructor() {
		super();
		this.state = {
			selectedApp: '',
			apps: []
		};
	}

	componentDidMount() {
		crn.getApps((err, res) => {
			this.setState({apps: res.body});
		});
	}

	render() {

		let options = this.state.apps.map((app) => {
			return <option key={app.id} value={app.id}>{app.label}</option>;
		});

		return (
			<div className="dataset">
				<h5>Choose an analysis pipeline to run on dataset {this.props.dataset.name}</h5>
				<div>
					<div className="text-danger">{this.state.error}</div>
					<select value={this.state.selectedApp} onChange={this._selectApp.bind(this)}>
						<option value="" disabled>Select a Task</option>
						{options}
					</select>
					<button className="btn-admin admin-blue">Start</button>
				</div>
			</div>
    	);
	}

// custom methods -----------------------------------------------------

	_selectApp(e) {
		this.setState({selectedApp: e.target.value});
	}

}