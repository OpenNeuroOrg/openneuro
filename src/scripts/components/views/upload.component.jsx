// dependencies -------------------------------------------------------

import React from 'react'
import DirUpload from'../forms/dirUpload.component.jsx';
import DirTree from'../forms/dirTree.component.jsx';
import { Alert, Accordion, Panel, ProgressBar } from 'react-bootstrap';

let Upload = React.createClass({

// life cycle events --------------------------------------------------

	getInitialState () {
		return {
			tree: [],
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
		let dirName = this.state.dirName;
		let fakeProgress = this.state.fakeProgress;
		let showAlert = this.state.alert;
		let alert = (
			<Alert className="fadeInDown" bsStyle='danger'>
				<strong>Holy danger!</strong> Best check yo self, youre not looking too good.
			</Alert>
		);
		let dataView = (
			<div className="dirDisplay">
			   	<h3 className="clearfix">
			   		<span className="dirName">
				   		<i className="folderIcon fa fa-folder-open" /> 
				   		{dirName}
			   		</span> 
				   	<div className=" validate-btn pull-right">
				   		<button>
				   			Validate 
				   		</button>
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
		);
		// Alert bsStyle: danger, warning, success, info
		return (
			<div className="view container">
				<DirUpload onChange={self._onChange} />
				   	{tree.length > 0 ? dataView : null}
					{showAlert ? alert : null}
			</div>
    	);
	
	},

// custom methods -----------------------------------------------------

	_onChange (directory) {
		let self = this;
		this.setState({
			tree: directory,
			dirName: directory[0].name,
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
	}

});


export default Upload;





