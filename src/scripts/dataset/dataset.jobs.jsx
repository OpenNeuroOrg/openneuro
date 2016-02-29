// dependencies -------------------------------------------------------

import React        from 'react';
import Reflux       from 'reflux';
import datasetStore from './dataset.store';
import actions      from './dataset.actions';
import Spinner      from '../common/partials/spinner.jsx';
import { Accordion, Panel } from 'react-bootstrap';
import WarnButton   from '../common/forms/warn-button.jsx';

let Jobs = React.createClass({

    mixins: [Reflux.connect(datasetStore)],

// life cycle events --------------------------------------------------

	render () {

		let jobs = this.state.jobs.map((job) => {
			let results, parameters;

			if (job.results) {
				results = job.results.map((result, index) => {
					return (
						<li key={index}>
							<WarnButton
								icon="fa-download"
								tooltip="Download File"
								prepDownload={actions.getResultDownloadTicket.bind(this, job.jobId, result.name)} />
							<span>{result.name}</span>
						</li>
					);
				});
			}

			if (job.parameters) {
				parameters = [];
				for (let key in job.parameters) {
					parameters.push(
						<li key={key}>
							<span>{key}</span>: <span>{job.parameters[key]}</span>
						</li>
					);
				}
			}
			let jobAccordionHeader = (<div className={job.agave.status.toLowerCase()}>{job.name}<span className="badge">{job.agave.status}</span></div>);
			return (
				<Panel className="job" header={jobAccordionHeader}  key={job._id} eventKey={job._id}>
						<h5>application: {job.appId}</h5>
						<p>created by {job.userId} at {job.agave.created}</p>
						{/*
						<p>id: {job._id}</p>
						<p>agave job ID: {job.jobId}</p>
						*/}
						<ul>{parameters}</ul>
					<Accordion accordion className="results">
						<Panel className="fadeIn" header="Download Results"  key={job._id} eventKey={job._id}>
							<ul>{results}</ul>
						</Panel>
					</Accordion>
				</Panel>
			);
		});
		let header = <h3 className="metaheader">Analyses</h3>;
		return (
			<div className="analyses">
				{jobs.length === 0 ?  null : header }
			<Accordion accordion className="jobs-wrap">
				{this.state.loadingJobs ? <Spinner active={true} /> : jobs}
			</Accordion>
			</div>
    	);
	},

// custom methods -----------------------------------------------------

	_downloadResult(jobId, fileName) {
		actions.downloadResult(jobId, fileName);
	},

});

export default Jobs;