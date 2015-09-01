// dependencies -------------------------------------------------------

import React        from 'react';
import Reflux       from 'reflux';
import {State}      from 'react-router';
import FileTree     from '../upload/upload.file-tree.jsx';
import Spinner      from '../common/partials/spinner.component.jsx';
import {Link}       from 'react-router';
import {Accordion, Panel} from 'react-bootstrap';

import datasetStore from './dataset.store';
import Actions      from './dataset.actions.js';
import Metadata     from './dataset.metadata.jsx';
import Tools        from './dataset.tools.jsx';
import Statuses     from './dataset.statuses.jsx';

let Dataset = React.createClass({

    mixins: [State, Reflux.connect(datasetStore)],

// life cycle events --------------------------------------------------

	componentWillReceiveProps() {
		let params = this.getParams();
		Actions.loadDataset(params.datasetId);
	},

	componentDidMount() {
		let params = this.getParams();
		Actions.loadDataset(params.datasetId);
	},

	render() {
		let loading    = this.state.loading;
		let dataset    = this.state.dataset;
		let status     = this.state.status;
		let userOwns   = this.state.userOwns;

		let tools;
		if (dataset && userOwns && !dataset[0].public) {
			tools = <Tools datasetId={dataset[0]._id} />
		}

		let content;
		if (dataset) {
			content = (
				<div>
					<h1>{dataset[0].name}</h1>
					{tools}
					<Statuses />
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
	}

});

export default Dataset;