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
			parameters: [],
			selectedApp: '',
			message: null
		};
	}

	render() {

		let options = this.props.apps.map((app) => {
			return <option key={app.id} value={app.id}>{app.label}</option>;
		});

		let loadingText = this.props.loadingApps ? 'Loading pipelines' : 'Starting ' + this.state.selectedApp;

		let form = (
			<div>
				<h5>Choose an analysis pipeline to run on dataset {this.props.dataset.name}</h5>
				<div className="text-danger">{this.state.error}</div>
				<select value={this.state.selectedApp} onChange={this._selectApp.bind(this)}>
					<option value="" disabled>Select a Task</option>
					{options}
				</select>
				<button onClick={this._restoreDefaultParameters.bind(this)}>Restore Default Parameters</button>
				<div>
					{this._parameters()}
				</div>
				<button className="btn-admin admin-blue" onClick={this._startJob.bind(this)}>Start</button>
			</div>
		);

		let message = (
			<div>
				<h5>{this.state.message}</h5>
				<button onClick={actions.toggleModal.bind(this,'Jobs')}>OK</button>
			</div>
		);

		let body;
		if (this.state.loading || this.props.loadingApps) {
			body = <Spinner active={true} text={loadingText}/>;
		} else if (this.state.message) {
			body = message;
		} else {
			body = form;
		}

		return (
			<div className="dataset">
				{body}
			</div>
    	);
	}

	// return is
		// loading
		// form
		// message

// custom methods -----------------------------------------------------

	/**
	 * Parameters
	 *
	 * Returns an array of input markup
	 * for the parameters of the selected
	 * app.
	 */
	_parameters() {
		let parameters = this.state.parameters.map((parameter) => {
			let input;
			switch (parameter.type) {
				case 'bool':
					input = <input type="checkbox" checked={parameter.value} onChange={this._updateParameter.bind(this, parameter.id)}/>;
					break;
				case 'number':
					input = <input value={parameter.value} onChange={this._updateParameter.bind(this, parameter.id)}/>;
					break;
				case 'string':
					input = <input value={parameter.value} onChange={this._updateParameter.bind(this, parameter.id)}/>;
					break;
				case 'flag':
					input = <input value={parameter.value} onChange={this._updateParameter.bind(this, parameter.id)}/>;
					break;
			}
			return (
				<div key={parameter.id}>
					<label>{parameter.label}</label><br />
					<span>{parameter.description}</span><br />
					{input}<br /><br />
				</div>
			);
		});

		return parameters;
	}

	/**
	 * Update Parameter
	 *
	 * Takes a parameter id and the
	 * onChange event and updates the
	 * parameter to the new value.
	 */
	_updateParameter(id, e) {
		let value = e.target.value;
		let parameters = this.state.parameters;
		for (let parameter of parameters) {
			if (parameter.id === id) {
				if (parameter.type === 'bool') {
					parameter.value = !parameter.value;
				} else {
					parameter.value = value;
				}
			}
		}
		this.setState({parameters});
	}

	/**
	 * Restore Default Parameters
	 */
	_restoreDefaultParameters() {
		let parameters = this.state.parameters;
		for (let parameter of parameters) {
			parameter.value = parameter.default;
		}
		this.setState({parameters});
	}

	/**
	 * Select App
	 */
	_selectApp(e) {
		let selectedApp = e.target.value;
		let parameters = [], parametersSpec = [];
		for (let app of this.props.apps) {
			if (app.id === selectedApp) {
				parametersSpec = app.parameters;
				break;
			}
		}
		for (let parameter of parametersSpec) {
			parameters.push({
				id:          parameter.id,
				label:       parameter.details.label,
				description: parameter.details.description,
				type:        parameter.value.type,
				default:     parameter.value.default,
				value:       parameter.value.default
			});
		}
		this.setState({selectedApp, parameters});
	}

	/**
	 * Start Job
	 */
	_startJob() {
		let parameters = {};
		for (let parameter of this.state.parameters) {
			if (parameter.type === 'number') {parameter.value = Number(parameter.value);}
			parameters[parameter.id] = parameter.value;
		}
		this.setState({loading: true});
		actions.startJob('test', this.state.selectedApp, parameters, (res) => {
			this.setState({loading: false, message: res.message});
		});
	}
}