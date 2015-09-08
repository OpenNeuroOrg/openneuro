// dependencies -------------------------------------------------------

import React        from 'react';
import Reflux       from 'reflux';
import {State}      from 'react-router';
import Spinner      from '../common/partials/spinner.component.jsx';
import {Link}       from 'react-router';
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
		let loading    	= this.state.loading;
		let dataset    	= this.state.dataset;
		let status     	= this.state.status;
		let tools;
		if (dataset && dataset.userOwns && !dataset.public) {
			tools = <Tools datasetId={dataset._id} />
		}

		let content;
		if (dataset) {
			let myDatasetsLink = <Link to="datasets">My Datasets</Link>;
			let PublicDatasetsLink = <Link to="public">Public Datasets</Link>;
			content = (
				<div className="fadeIn">
					<ol className="breadcrumb">
						<li>{dataset.public && !dataset.userOwns ? PublicDatasetsLink : myDatasetsLink}</li>
						<li className="active">{dataset.name}</li>
					</ol>
					
					<div  className="clearfix">
						<div className="row">
							<div className="col-xs-6">
								<h1 className="clearfix">
									<span className="dataset-name">{dataset.name}</span> 
									<Statuses dataset={dataset}/>
								</h1>
							</div>
							<div className="col-xs-6">
								{tools}
							</div>
						</div>
						<Metadata dataset={dataset}/>
					</div>
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