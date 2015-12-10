// dependencies -------------------------------------------------------

import React        from 'react';
import Reflux       from 'reflux';
import datasetStore from './dataset.store';
import actions      from './dataset.actions';
import WarnButton   from '../common/forms/warn-button.jsx';
import Spinner      from '../common/partials/spinner.jsx';

let Jobs = React.createClass({

    mixins: [Reflux.connect(datasetStore)],

// life cycle events --------------------------------------------------

	render () {
		let jobs = this.state.jobs.map((job) => {
			let results;
			if (job.results) {
				results = job.results.map((result, index) => {
					return (
						<a key={index} onClick={this._downloadResult.bind(this, job.jobId, result.name)}>{result.name}</a>
					);
				});
			}
			let style = {border: "1px solid #CCC"};
			return (
				<li key={job._id} style={{border: "1px solid #CCC", margin: "10px 0px 10px 0px"}}>
					<div>name: {job.name}</div>
					<div>application: {job.appId}</div>
					<div>status: {job.agave.status}</div>
					<div>created by {job.userId} at {job.agave.created}</div>
					<div>id: {job._id}</div>
					<div>agave job ID: {job.jobId}</div>
					<div>{results}</div>
				</li>
			);
		});
		return (
			<div className="panel-body">
				<ul className="top-level-item">
					{this.state.loadingJobs ? <Spinner active={true} /> : jobs}
				</ul>
			</div>
    	);
	},

// custom methods -----------------------------------------------------

	_downloadResult(jobId, fileName) {
		actions.downloadResult(jobId, fileName);
	}

});

export default Jobs;