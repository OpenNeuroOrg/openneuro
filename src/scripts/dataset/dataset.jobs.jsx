// dependencies -------------------------------------------------------

import React        from 'react';
import Reflux       from 'reflux';
import datasetStore from './dataset.store';
import actions      from './dataset.actions';
import WarnButton   from '../common/forms/warn-button.jsx';
import Spinner      from '../common/partials/spinner.jsx';
import { Accordion, Panel } from 'react-bootstrap';

let Jobs = React.createClass({

    mixins: [Reflux.connect(datasetStore)],

// life cycle events --------------------------------------------------

	render () {

		let jobs = this.state.jobs.map((job) => {
			let results;


			if (job.results) {
				results = job.results.map((result, index) => {
					return (
						<li>
							<a key={index} onClick={this._downloadResult.bind(this, job.jobId, result.name)}>
								{result.name}
							</a>
						</li>
					);
				});
			}
			return (
				<Panel className="fadeIn job-item" header={job.name}  key={job._id} eventKey={job._id}>
					<h5>application: {job.appId}</h5>
					<h5>status: {job.agave.status}</h5>
					<p>created by {job.userId} at {job.agave.created}</p>
					<p>id: {job._id}</p>
					<p>agave job ID: {job.jobId}</p>
					<ul className="results">{results}</ul>
				</Panel>
			);
		});
		console.log(jobs);
		return (
			<div>
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