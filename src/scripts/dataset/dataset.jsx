// dependencies -------------------------------------------------------

import React    from 'react';
import {State}  from 'react-router';
import mixin    from 'es6-react-mixins';
import scitran  from '../utils/scitran';
import FileTree from '../upload/upload.file-tree.jsx';
import Spinner  from '../common/partials/spinner.component.jsx';

export default class Dataset extends mixin(State) {

// life cycle events --------------------------------------------------

	constructor() {
		super();
		this.state = {
			loading: false,
			dataset: []
		};
	}

	componentDidMount () {
		let self = this;
		let params = this.getParams();
		self.setState({loading: true});
		scitran.getBIDSDataset(params.datasetId, function (dataset) {
			self.setState({dataset: dataset, loading: false});
		});
	}

	render () {
		let dataset = this.state.dataset;
		let loading = this.state.loading;
		
		return (
			<div>
            	<Spinner text="loading" active={loading} />
            	<h1>{dataset[0] ? dataset[0].name : null}</h1>
				<FileTree tree={dataset} />
			</div>
    	);
	}

}