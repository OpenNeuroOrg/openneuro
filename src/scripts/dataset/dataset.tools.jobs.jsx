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
			message: null,
			error: false
		};
	}

	render() {

		let options = this.props.apps.map((app) => {
			return <option key={app.id} value={app.id}>{app.label}</option>;
		});

		let loadingText = this.props.loadingApps ? 'Loading pipelines' : 'Starting ' + this.state.selectedApp;

		let form = (
			<div className="anaylsis-modal clearfix">
				<h5>Choose an analysis pipeline to run on dataset {this.props.dataset.name}</h5>
				<div className="row">
					<div className="col-xs-12">
						<div className="col-xs-6 task-select">
							<select value={this.state.selectedApp} onChange={this._selectApp.bind(this)}>
								<option value="" disabled>Select a Task</option>
								{options}
							</select>
						</div>
						<div className="col-xs-6 default-reset">
							<button className="btn-reset" onClick={this._restoreDefaultParameters.bind(this)}>Restore Default Parameters</button>
						</div>
					</div>
				</div>
				{this._parameters()}
			</div>
		);

		let message = (
			<div>
				{this.state.error ? <h4 className="danger">Error</h4> : null}
				<h5>{this.state.message}</h5>
				<button className="btn-admin-blue" onClick={actions.toggleModal.bind(this,'Jobs')}>OK</button>
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
					input = <span><input className="form-control checkbox" type="checkbox" id={"check-" + parameter.id} checked={parameter.value} onChange={this._updateParameter.bind(this, parameter.id)}/><label htmlFor={"check-" + parameter.id} className="checkmark"><span></span></label></span>;
					break;
				case 'number':
					input = <input className="form-control" value={parameter.value} onChange={this._updateParameter.bind(this, parameter.id)}/>;
					break;
				case 'string':
					input = <input className="form-control" value={parameter.value} onChange={this._updateParameter.bind(this, parameter.id)}/>;
					break;
				case 'flag':
					input = <input className="form-control" value={parameter.value} onChange={this._updateParameter.bind(this, parameter.id)}/>;
					break;
			}
			return (
				<div>
					<div className="parameters form-horizontal">
		    			<div className="form-group" key={parameter.id}>
							<label className="sr-only">{parameter.label}</label>
							<div className="input-group">
			      				<div className="input-group-addon">{parameter.label}</div>
								<div className="clearfix">
									{input}
									<span className="help-text">{parameter.description}</span>
								</div>
							</div>
						</div>
					</div>
					<div className="col-xs-12 modal-actions">
						<button className="btn-admin-blue" onClick={this._startJob.bind(this)}>Start</button>
					</div>
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
		actions.startJob('test', this.state.selectedApp, parameters, (err, res) => {
			let message, error;
			if (err) {
				error   = true;
				message = "There was an issue submitting your analysis. Please double check you inputs and try again. If the issue persists contact the site adminstrator.";
			} else {
				message = "Your analysis has been submitted. Periodically check the analysis section of this dataset to view the status and results."
			}
			this.setState({loading: false, message: message, error: error});
		});
	}
}