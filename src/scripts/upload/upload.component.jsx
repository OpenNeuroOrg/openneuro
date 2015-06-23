// dependencies -------------------------------------------------------

import React     from 'react'
import DirUpload from './dirUpload.component.jsx';
import DirTree   from './dirTree.component.jsx';
import validate  from '/Users/gregorynoack/Sites/SQM/CRN/bidslint';
import DirValidationMessages from './dirValidationMessages.component.jsx';
import { Alert, Accordion, Panel, ProgressBar } from 'react-bootstrap';

let Upload = React.createClass({

// life cycle events --------------------------------------------------

	getInitialState () {
		return {
			tree: [],
			list: {},
			errors: [],
			dirName: '',
			fakeProgress: 0,
			alert: false
		};
	},

	componentDidMount () {
		let self = this;
	},

	render () {
		let self = this;
		let tree = this.state.tree;
		let list = this.state.list;
		let errors = this.state.errors;
		let dirName = this.state.dirName;
		let fakeProgress = this.state.fakeProgress;
		let showAlert = this.state.alert;
		let alert = (
			<Alert className="fadeInDown" bsStyle='danger'>
				<strong>Holy danger!</strong> Best check yo self, youre not looking too good.
			</Alert>
		);
		let dataView = (
			<div className="row">
				<div className="dirDisplay col-xs-6">
				   	<h3 className="clearfix">
				   		<span className="dirName">
					   		<i className="folderIcon fa fa-folder-open" /> 
					   		{dirName}
				   		</span> 
					   	<div className=" validate-btn pull-right">
							<button onClick={self._validate}>Validate</button>
					   		<span>
					   			Validating <i className="fa fa-circle-o-notch fa-spin" />
					   		</span>
					   	</div>
				   	</h3>
				   	<ProgressBar now={fakeProgress} />
				   	<Accordion className="fileStructure">
	    				<Panel header={<i className="fa fa-chevron-down"> See File Structure</i> } eventKey='1'>
					  		<DirTree tree={tree}/>
					  	</Panel>
				  	</ Accordion> 
				</div>
				<div className="col-xs-6"> 
					<DirValidationMessages errors={errors} />
				</div>
			</div>
		);
		// Alert bsStyle: danger, warning, success, info
		return (
			<div className="view container">
				<div className="row">
					<div className="col-sm-12 col-md-offset-4 col-md-4">
						<DirUpload onChange={self._onChange} />
					</div>
				</div>
			   	{tree.length > 0 ? dataView : null}
				{showAlert ? alert : null}
			</div>
    	);
	
	},

// custom methods -----------------------------------------------------

	_onChange (files) {
		let self = this;
		this.setState({
			tree: files.tree,
			list: files.list,
			dirName: files.tree[0].name,
			fakeProgress: 0,
			alert: true
		});
		setInterval(this._fakeProgress, 3000);
		setTimeout(function () {
			self.setState({alert: false});
		}, 4000);
	},

	_fakeProgress () {
		let self= this;
		
		this.setState({
	    	fakeProgress: self.state.fakeProgress + 1,
		});
	},

	_validate: function () {
		let self = this;
        validate.BIDS(this.state.list, function (errors) {
            self.setState({errors: errors});
        });
	}

});


export default Upload;





