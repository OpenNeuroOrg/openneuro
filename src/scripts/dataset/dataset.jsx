// dependencies -------------------------------------------------------

import React        from 'react';
import Reflux       from 'reflux';
import {State}      from 'react-router';
import Spinner      from '../common/partials/spinner.jsx';
import {Link}       from 'react-router';
import datasetStore from './dataset.store';
import Actions      from './dataset.actions.js';
import MetaData    	from './dataset.metadata.jsx';
import Tools        from './dataset.tools.jsx';
import Statuses     from './dataset.statuses.jsx';
import moment       from 'moment';
import ClickToEdit  from '../common/forms/click-to-edit.jsx';
import FileTree     from './dataset.file-tree.jsx';
import Jobs         from './dataset.jobs.jsx';

let Dataset = React.createClass({

    mixins: [State, Reflux.connect(datasetStore)],

// life cycle events --------------------------------------------------

	componentWillReceiveProps() {
		let params = this.getParams();
		if (this.state.dataset && params.datasetId !== this.state.dataset._id) {
			Actions.loadDataset(params.datasetId);
		}
	},

	componentDidMount() {
		let params = this.getParams();
		Actions.loadDataset(params.datasetId);
	},

	componentWillUnmount() {
		Actions.setInitialState({apps: this.state.apps});
	},

	render() {
		let loading = this.state.loading;
		let dataset = this.state.dataset;
		let status  = this.state.status;
		let dateAdded  = dataset ? moment(dataset.timestamp).format('L') : null;
        let timeago    = dataset ? moment(dataset.timestamp).fromNow(true) : null;
		let canEdit = dataset && (dataset.access === 'rw' || dataset.access == 'admin');
		let content;
		if (dataset) {
			let myDatasetsLink = <Link to="datasets">My Datasets</Link>;
			let PublicDatasetsLink = <Link to="public">Public Datasets</Link>;
			content = (
				<div className="fadeIn dashboard">
					<div className="clearfix">
					<div className="col-xs-12 dataset-tools-wrap">
						<Tools />
					</div>
						<div className="col-xs-12">	
							<div className="row">	
								<div className="col-xs-7">
								<h1 className="clearfix">
										<ClickToEdit
											value={dataset.name}
											label={false}
											editable={canEdit}
											onChange={Actions.updateName}/>
									</h1>
									<h6>uploaded {dataset.userOwns ? 'by ' + dataset.group : null} on {dateAdded} - {timeago} ago</h6>
									<div className="status-container">
										<Statuses dataset={dataset}/>
									</div>
									<MetaData dataset={dataset}/>
								</div>
								<div className="col-xs-5">
									<div>
										<div className="fadeIn col-xs-12">
											<Jobs />
										</div>
										<div className="col-xs-12">
											<div className="fileStructure fadeIn panel-group">
												<div className="panel panel-default">
													<div className="panel-heading" >
														<h4 className="panel-title">Dataset File Tree</h4>
													</div>
													<div className="panel-collapse" aria-expanded="false" >
														<div className="panel-body">
															<FileTree tree={[dataset]} editable={canEdit}/>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			);
		} else {
			let message;
			if (status === 404) {message = 'Dataset not found';}
			if (status === 403) {message = 'You are not authorized to view this dataset';}
			content = (
				<div>
					<h2 className="message-4">{message}</h2>
				</div>
			);
		}

		return (
			<div className="fadeIn inner-route dataset light">
            	<Spinner text="loading" active={loading} />
            	{content}
			</div>
    	);
	}

});

export default Dataset;