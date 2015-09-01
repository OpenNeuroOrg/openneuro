// dependencies -------------------------------------------------------

import React        from 'react';
import Reflux       from 'reflux';
import {State}      from 'react-router';
import FileTree     from '../upload/upload.file-tree.jsx';
import Spinner      from '../common/partials/spinner.component.jsx';
import WarnButton   from '../common/forms/warn-button.component.jsx';
import {Link}       from 'react-router';
import {Accordion, Panel} from 'react-bootstrap';

import datasetStore from './dataset.store';
import Actions      from './dataset.actions.js';
import Metadata     from './dataset.metadata.jsx';

let Dataset = React.createClass({

    mixins: [State, Reflux.connect(datasetStore)],

// life cycle events --------------------------------------------------

	componentWillReceiveProps() {
		let params = this.getParams();
		this._loadDataset(params.datasetId);
	},

	componentDidMount() {
		let params = this.getParams();
		this._loadDataset(params.datasetId);
	},

	render() {
		let loading    = this.state.loading;
		let dataset    = this.state.dataset;
		let status     = this.state.status;
		let userOwns   = this.state.userOwns;

		let tools;
		if (userOwns && !dataset[0].public) {
			tools = (
				<div>
					<WarnButton message="Make Public" confirm="Yes Make Public" icon="fa-share" action={this._publish.bind(this, dataset[0]._id)} />
		            <WarnButton message="Delete this dataset" action={this._deleteDataset.bind(this, dataset[0]._id)} />
		        </div>
            );
		}

		let statuses = (
			<div>
				{dataset && dataset[0].status && dataset[0].status.uploadIncomplete ? <span>incomplete <i className="fa fa-warning"></i></span> : null}
			</div>
		)

		let content;
		if (dataset) {
			content = (
				<div>
					<h1>{dataset[0].name}</h1>
					{tools}
					{statuses}
					<Metadata />
					<Accordion className="fileStructure fadeIn">
						<Panel header={dataset[0].name} eventKey='1'>
					  		<FileTree tree={dataset} />
					  	</Panel>
			  		</Accordion>
				</div>
			);
		} else {
			let message;
			if (status === 404) {message = 'Dataset not found.';}
			if (status === 403) {message = 'You are not authorized to view this dataset.';}
			content = (
				<div>
					<h1>{message}</h1>
				</div>
			);
		}

		return (
			<div className="fadeIn inner-route dataset">
            	<Spinner text="loading" active={loading} />
            	{content}
			</div>
    	);
	},

// custon methods -----------------------------------------------------

	_loadDataset: Actions.loadDataset,

	_publish: Actions.publish,

	_deleteDataset: Actions.deleteDataset

});

export default Dataset;