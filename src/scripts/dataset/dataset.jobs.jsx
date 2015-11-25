// dependencies -------------------------------------------------------

import React      from 'react';
import actions    from './dataset.actions';
import WarnButton from '../common/forms/warn-button.jsx';

export default class FileTree extends React.Component {

// life cycle events --------------------------------------------------

	render () {
		let jobs = this.props.jobs.map((job) => {
			let results;
			if (job.results) {
				results = job.results.map((result, index) => {
					return (
						<a href={"http://localhost:8765/api/v1/download-results?path=" + result._links.self.href}>{result.name}</a>
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
			<ul className="top-level-item">{jobs}</ul>
    	);
	}

// custom methods -----------------------------------------------------

	_downloadResult(href) {
		actions.downloadResult(href);
	}

}