// dependencies -------------------------------------------------------

import React from 'react'
import DirUpload from'../forms/dirUpload.component.jsx';
import DirTree from'../forms/dirTree.component.jsx';
import { Alert, Accordion, Panel, ProgressBar } from 'react-bootstrap';



let adder = 0;

let Upload = React.createClass({

// life cycle events --------------------------------------------------

	getInitialState: function () {
		return {
			tree: [],
			dirName: '',
			fakeProgress: 0,
			alert: true
		};
	},

	componentDidMount: function () {
		let self = this;
		setInterval(this._fakeProgress, 3000);
		setTimeout(function () {
			self.setState({alert: false});
		}, 2000)
	},

	render: function () {
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
		// Alert bsStyle: danger, warning, success, info
		return (
			<div className="view container">
				<DirUpload onChange={self._onChange} />
				   	{tree.length > 0 ? 
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
					 : ''}
					{showAlert ? alert : ''}
			</div>
    	);
	
	},

// custom methods -----------------------------------------------------

	_onChange (directory) {
		this.setState({
			tree: directory,
			dirName: directory[0].name,
			fakeProgress: 0
		})
	},
	_fakeProgress(){
		let self= this;
		
		 this.setState({
		    	fakeProgress: adder++,
		 })
	}

});


export default Upload;





