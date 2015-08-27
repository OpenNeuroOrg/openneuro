// dependencies -------------------------------------------------------

import React     from 'react';
import {State}   from 'react-router';
import mixin     from 'es6-react-mixins';
import scitran   from '../utils/scitran';
import FileTree  from '../upload/upload.file-tree.jsx';
import Spinner   from '../common/partials/spinner.component.jsx';
import userStore from '../user/user.store';
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

	componentDidMount() {
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

	render() {
		let loading   = this.state.loading;
		let dataset   = this.state.dataset;
		let notFound  = this.state.notFound;
		let userOwns  = this._userOwns(dataset);

		let publishBtn;
		if (userOwns) {
			publishBtn = <button onClick={this._publish.bind(this, dataset._id)}>Make Public</button>;
		}

		let content;
		if (dataset) {
			content = (
				<div>
					<h1>{dataset[0].name}</h1>
					{publishBtn}
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

// custon methods -----------------------------------------------------

	_publish(datasetId) {
		scitran.updateProject(datasetId, {body: {public: true}}, function (err, res) {
			console.log(err);
			console.log(res);
		});
	}

	_userOwns(dataset) {
		let userOwns = false
		if (dataset && dataset[0].permissions)
		for (let user of dataset[0].permissions) {
			if (userStore.data.scitran._id === user._id) {
				userOwns = true;
			}
		}
		return userOwns;
	}
}