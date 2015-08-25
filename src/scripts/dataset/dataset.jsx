// dependencies -------------------------------------------------------

import React    from 'react';
import {State}  from 'react-router';
import mixin    from 'es6-react-mixins';
import scitran  from '../utils/scitran';
import FileTree from '../upload/upload.file-tree.jsx';
import Spinner  from '../common/partials/spinner.component.jsx';
import {Accordion, Panel} from 'react-bootstrap';

export default class Dataset extends mixin(State) {

// life cycle events --------------------------------------------------

	constructor() {
		super();
		this.state = {
			loading: false,
			dataset: null,
			notFound: false
		};
	}

	componentDidMount () {
		let self = this;
		let params = this.getParams();
		self.setState({loading: true});
		scitran.getBIDSDataset(params.datasetId, function (res) {
			if (res.status === 404) {
				self.setState({notFound: true, loading: false});
			} else {
				self.setState({dataset: res, loading: false});
			}
		});
	}

	render () {
		let loading  = this.state.loading;
		let dataset  = this.state.dataset;
		let notFound = this.state.notFound;

		let content;
		if (dataset) {
			content = (
				<div>
					<h1>{dataset[0].name}</h1>
					<Accordion className="fileStructure fadeIn">
						<Panel header={dataset[0].name} eventKey='1'>
					  		<FileTree tree={dataset} />
					  	</Panel>
			  		</Accordion>
				</div>
			);
		} else if (notFound) {
			content = (
				<div>
					<h1>Dataset not found.</h1>
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

}