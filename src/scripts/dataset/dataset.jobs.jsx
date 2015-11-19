// dependencies -------------------------------------------------------

import React      from 'react';
import actions    from './dataset.actions';
import WarnButton from '../common/forms/warn-button.jsx';

export default class FileTree extends React.Component {

// life cycle events --------------------------------------------------

	render () {
		let jobs = this.props.dataset.jobs.map((job) => {
			return (
				<li key={job._id}>
					<div>name: {job.name}</div>
					<div>application: {job.appId}</div>
					<div>status: {job.agave.status}</div>
					<div>created by {job.userId} at {job.agave.created}</div>
					<div>id: {job._id}</div>
					<div>agave job ID: {job.jobId}</div>
				</li>
			);
		});
		return (
			<ul className="top-level-item">{jobs}</ul>
    	);
	}

// custom methods -----------------------------------------------------

}