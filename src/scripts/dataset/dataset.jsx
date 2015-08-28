// dependencies -------------------------------------------------------

import React       from 'react';
import {State}     from 'react-router';
import mixin       from 'es6-react-mixins';
import scitran     from '../utils/scitran';
import FileTree    from '../upload/upload.file-tree.jsx';
import Spinner     from '../common/partials/spinner.component.jsx';
import ClickToEdit from '../common/forms/click-to-edit.jsx';
import WarnButton  from '../common/forms/warn-button.component.jsx'; 
import userStore   from '../user/user.store';
import router      from '../utils/router-container';
import {Link}      from 'react-router';
import {Accordion, Panel} from 'react-bootstrap';

export default class Dataset extends mixin(State) {

// life cycle events --------------------------------------------------

	constructor() {
		super();
		this.state = {
			loading: false,
			dataset: null,
			status: null
		};
	}

	componentDidMount() {
		console.log('here');
		let params = this.getParams();
		this._loadDataset(params.datasetId);
	}

	componentShouldUpdate() {
		console.log('should update');
	}

	render() {
		let loading   = this.state.loading;
		let dataset   = this.state.dataset;
		let status    = this.state.status;
		let userOwns  = this._userOwns(dataset);

		let description = {
		    "Name": "The mother of all experiments",
		    "License": "CC0",
		    "Authors": ["Ramon y Cajal"],
		    "Acknowledgements": "say here what are your acknowledgments",
		    "HowToAcknowledge": "say here how you would like to be acknowledged",
		    "Funding": "list your funding sources",
		    "ReferencesAndLinks": "a paper / resource to be cited when using the data"
		};

		let README = "README file is plain text and can follow any format you would like";

		let descriptors = (
			<div>
				<div>
					<label>Name</label><br />
					<ClickToEdit value={description['Name']} editable={userOwns} />
				</div>
				<div>
					<label>License</label><br />
					<ClickToEdit value={description['License']} editable={userOwns} />
				</div>
				<div>
					<label>Authors</label><br />
					<ClickToEdit value={description['Authors']} editable={userOwns} type="array" />
				</div>
				<div>
					<label>Acknowledgements</label><br />
					<ClickToEdit value={description['Acknowledgements']} editable={userOwns} type="textarea" />
				</div>
				<div>
					<label>How To Acknowledge</label><br />
					<ClickToEdit value={description['HowToAcknowledge']} editable={userOwns} type="textarea" />
				</div>
				<div>
					<label>Funding</label><br />
					<ClickToEdit value={description['Funding']} editable={userOwns} type="textarea" />
				</div>
				<div>
					<label>References And Links</label><br />
					<ClickToEdit value={description['ReferencesAndLinks']} editable={userOwns}  type="textarea" />
				</div>
				<div>
					<label>README</label><br />
					<ClickToEdit value={README} editable={userOwns} type="textarea" />
				</div>
			</div>
		);


		let tools;
		if (userOwns && !dataset[0].public) {
			tools = (
				<div>
					<WarnButton message="Make Public" confirm="Yes Make Public" icon="fa-share" action={this._publish.bind(this, dataset[0]._id)} />
		            <WarnButton message="Delete this dataset" action={this._deleteDataset.bind(this, dataset[0]._id)} />
		        </div>
            );
		}

		let content;
		if (dataset) {
			content = (
				<div>
					<h1>{dataset[0].name}</h1>
					{tools}
					<div className="well">{descriptors}</div>
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

// custon methods -----------------------------------------------------

	_loadDataset(datasetId) {
		let self = this;
		self.setState({loading: true});
		scitran.getBIDSDataset(datasetId, function (res) {
			if (res.status === 404 || res.status === 403) {
				self.setState({status: res.status, loading: false});
			} else {
				self.setState({dataset: res, loading: false});
			}
		});
	}

	_publish(datasetId) {
		let self = this;
		scitran.updateProject(datasetId, {body: {public: true}}, function (err, res) {
			if (!err) {
				let dataset = self.state.dataset;
				dataset[0].public = true;
				self.setState({dataset});
			}
		});
	}

	_deleteDataset(datasetId) {
		let self = this;
		scitran.deleteDataset(datasetId, function () {
            router.transitionTo('dashboard');
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