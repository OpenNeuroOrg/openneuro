// dependencies -------------------------------------------------------

import React        from 'react';
import Reflux       from 'reflux';
import Spinner      from '../common/partials/spinner.jsx';
import {State}      from 'react-router';
import datasetStore from './dataset.store';
import actions      from './dataset.actions.js';
import MetaData    	from './dataset.metadata.jsx';
import Tools        from './dataset.tools.jsx';
import Statuses     from './dataset.statuses.jsx';
import moment       from 'moment';
import ClickToEdit  from '../common/forms/click-to-edit.jsx';
import FileTree     from './dataset.file-tree.jsx';
import Jobs         from './dataset.jobs.jsx';
import Results      from '../upload/upload.validation-results.jsx';
import UpdateWarn   from './dataset.update-warning.jsx';
import pluralize    from 'pluralize';

let Dataset = React.createClass({

    mixins: [State, Reflux.connect(datasetStore)],

// life cycle events --------------------------------------------------

	componentWillReceiveProps() {
		let params = this.getParams();
		if (params.snapshotId) {
			actions.trackView(params.snapshotId);
			actions.loadDataset(params.snapshotId, {snapshot: true});
		} else if (params.datasetId && this.state.dataset && params.datasetId !== this.state.dataset._id) {
			actions.loadDataset(params.datasetId);
		}
	},

	componentDidMount() {
		let params = this.getParams();
		if (params.snapshotId) {
			actions.trackView(params.snapshotId);
			actions.loadDataset(params.snapshotId, {snapshot: true});
		} else if (params.datasetId) {
			actions.loadDataset(params.datasetId);
		}
	},

	componentWillUnmount() {
		actions.setInitialState({apps: this.state.apps});
	},

	render() {
		let dataset = this.state.dataset;
		let tree    = this.state.datasetTree;
		let canEdit = dataset && (dataset.access === 'rw' || dataset.access == 'admin') && !dataset.original;
		let content;

		if (dataset) {

			let errors = dataset.validation.errors;
			let warnings = dataset.validation.warnings;

			content = (
				<div className="fadeIn dashboard">
					<div className="clearfix">
						<div className="col-xs-12 dataset-tools-wrap">
							<Tools dataset={dataset}
								   selectedSnapshot={this.state.selectedSnapshot}
								   snapshots={this.state.snapshots} />
						</div>
						<div className="col-xs-12 dataset-wrap">
							<div className="row">
								<div className="col-xs-7">
									<h1 className="clearfix">
										<ClickToEdit
											value={dataset.label}
											label={false}
											editable={canEdit}
											onChange={actions.updateName}/>
									</h1>
									{this._uploaded(dataset)}
									{this._authors(dataset.authors)}
									{this._views(dataset.views)}
									{this._downloads(dataset.downloads)}
									<div className="status-container">
										<Statuses dataset={dataset} />
									</div>
									<MetaData dataset={dataset} editable={canEdit} issues={this.state.metadataIssues} />
								</div>
								<div className="col-xs-5">
									<div>
										{this._validation(errors, warnings, dataset.status.validating)}
										<div className="fadeIn col-xs-12">
											<Jobs />
										</div>
										{this._fileTree(dataset, tree, canEdit)}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			);
		} else {
			let message;
			let status = this.state.status;
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
            	{this.state.loading ? <Spinner active={true} /> : content}
            	<UpdateWarn show={this.state.modals.update} onHide={actions.toggleModal.bind(null, 'update')} update={this.state.currentUpdate} />
			</div>
    	);
	},

// template methods ---------------------------------------------------

	_authors(authors) {
		if (authors.length > 0) {
			let authorString = 'authored by ';
			for (let i = 0; i < authors.length; i++) {
				let author = authors[i];
				authorString += author.name;
				if (authors.length > 1) {
					if (i < authors.length - 2) {
						authorString += ', ';
					} else if (i == authors.length -2) {
						authorString += ' and ';
					}
				}
			}
			return <h6>{authorString}</h6>;
		}
	},

	_downloads(downloads) {
		if (downloads) {return <h6>downloads: {downloads}</h6>;}
	},

	_fileTree(dataset, tree, canEdit) {
		tree = tree ? tree : [dataset];
		if (!dataset.status.incomplete) {
			return (
				<div className="col-xs-12">
					<div className="fileStructure fadeIn panel-group">
						<div className="panel panel-default">
							<div className="panel-heading" >
								<h4 className="panel-title">Dataset File Tree</h4>
							</div>
							<div className="panel-collapse" aria-expanded="false" >
								<div className="panel-body">
									<FileTree tree={tree} editable={canEdit} loading={this.state.loadingTree}/>
								</div>
							</div>
						</div>
					</div>
				</div>
			);
		}
	},

	_uploaded(dataset) {
		let user        = dataset ? dataset.user : null;
		let dateCreated = dataset.created;
		let dateAdded  = moment(dateCreated).format('L');
        let timeago    = moment(dateCreated).fromNow(true);
		return <h6>{'uploaded ' + (user ? 'by ' + user.firstname + ' ' + user.lastname : '') +  ' on ' + dateAdded + ' - ' + timeago + ' ago'}</h6>;
	},

	_validation(errors, warnings, validating) {
		if (validating) {
			return <Spinner text="Validating" active={true} />;
		}
		if (errors.length > 0 || warnings.length > 0) {
			let errMessage, warnMessage;
			if (errors === 'Invalid') {
				errMessage = "This does not appear to be a BIDS dataset";
			} else {
				if (errors.length > 0) {
					errMessage = <span className="message error fadeIn">Your dataset is no longer valid. You must fix the <strong>{errors.length + ' ' + pluralize('Error', errors.length)}</strong> to use all of the site features.</span>;
				}
				if (warnings.length > 0) {
					warnMessage = <span className="message error fadeIn">We found <strong>{warnings.length + ' ' + pluralize('Warning', warnings.length)}</strong> in your dataset. You are not required to fix warnings, but doing so will make your dataset more BIDS compliant.</span>;
				}
			}
			return (
				<div className="fadeIn col-xs-12">
					<h3 className="metaheader">Validation</h3>
					<div>{errMessage} {warnMessage}</div><br />
					<Results errors={errors} warnings={warnings} />
				</div>
			)
		}
	},

	_views(views) {
		if (views) {return <h6>views: {views}</h6>;}
	}

});

export default Dataset;