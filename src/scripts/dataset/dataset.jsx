// dependencies -------------------------------------------------------

import React         from 'react';
import Reflux        from 'reflux';
import Spinner       from '../common/partials/spinner.jsx';
import {Link, State} from 'react-router';
import datasetStore  from './dataset.store';
import Actions       from './dataset.actions.js';
import MetaData    	 from './dataset.metadata.jsx';
import Tools         from './dataset.tools.jsx';
import Statuses      from './dataset.statuses.jsx';
import moment        from 'moment';
import ClickToEdit   from '../common/forms/click-to-edit.jsx';
import FileTree      from './dataset.file-tree.jsx';
import Jobs          from './dataset.jobs.jsx';
import Results       from '../upload/upload.validation-results.jsx';

let Dataset = React.createClass({

    mixins: [State, Reflux.connect(datasetStore)],

// life cycle events --------------------------------------------------

	componentWillReceiveProps() {
		let params = this.getParams();
		if (params.snapshotId) {
			Actions.trackView(params.snapshotId);
			Actions.loadDataset(params.snapshotId, {snapshot: true});
		} else if (params.datasetId && this.state.dataset && params.datasetId !== this.state.dataset._id) {
			Actions.loadDataset(params.datasetId);
		}
	},

	componentDidMount() {
		let params = this.getParams();
		if (params.snapshotId) {
			Actions.trackView(params.snapshotId);
			Actions.loadDataset(params.snapshotId, {snapshot: true});
		} else if (params.datasetId) {
			Actions.loadDataset(params.datasetId);
		}
	},

	componentWillUnmount() {
		Actions.setInitialState({apps: this.state.apps});
	},

	render() {
		let loading    = this.state.loading;
		let dataset    = this.state.dataset;
		let user       = dataset ? dataset.user : null;
		let status     = this.state.status;
		let dateAdded  = dataset ? moment(dataset.created).format('L') : null;
        let timeago    = dataset ? moment(dataset.created).fromNow(true) : null;
		let canEdit    = dataset && (dataset.access === 'rw' || dataset.access == 'admin') && !dataset.original;
		let content;

		if (dataset) {

			let uploaded = 'uploaded ' + (user ? 'by ' + user.firstname + ' ' + user.lastname : '') +  ' on ' + dateAdded + ' - ' + timeago + ' ago';

			let authors;
			if (dataset.authors.length > 0) {
				authors = 'authored by ';
				for (let i = 0; i < dataset.authors.length; i++) {
					let author = dataset.authors[i];
					authors += author.name;
					if (dataset.authors.length > 1) {
						if (i < dataset.authors.length - 2) {
							authors += ', ';
						} else if (i == dataset.authors.length -2) {
							authors += ' and ';
						}
					}
				}
			}

			content = (
				<div className="fadeIn dashboard">
					<div className="clearfix">
						<div className="col-xs-12 dataset-tools-wrap">
							<Tools selectedSnapshot={this.state.selectedSnapshot} />
						</div>
						<div className="col-xs-12 dataset-wrap">
							<div className="row">
								<div className="col-xs-7">
									<h1 className="clearfix">
										<ClickToEdit
											value={dataset.label}
											label={false}
											editable={canEdit}
											onChange={Actions.updateName}/>
									</h1>
									<h6>{uploaded}</h6>
									<h6>{authors}</h6>
									{dataset.views ? <h6>views: {dataset.views}</h6> : null}
									<h6>downloads: {dataset.downloads}</h6>
									<div className="status-container">
										<Statuses dataset={dataset}/>
									</div>
									<MetaData dataset={dataset} editable={canEdit} />
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
											<Results errors={dataset.validation.errors} warnings={dataset.validation.warnings} />
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