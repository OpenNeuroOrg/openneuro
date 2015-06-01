// dependencies -------------------------------------------------------

import React from 'react'
import DirUpload from'../forms/dirUpload.component.jsx';
import DirTree from'../forms/dirTree.component.jsx';

import Alert from 'react-bootstrap/lib/Alert';
import Accordion from 'react-bootstrap/lib/Accordion';
import Panel from 'react-bootstrap/lib/Panel';
import ProgressBar from 'react-bootstrap/lib/ProgressBar';



let adder = 0;

let Upload = React.createClass({

// life cycle events --------------------------------------------------

	getInitialState: function () {
		return {
			tree: [],
			dirName: '',
			fakeProgress: 0
		};
	},
	render: function () {
		let self = this;
		let tree = this.state.tree;
		let dirName = this.state.dirName;
		let fakeProgress = this.state.fakeProgress;
		// Alert bsStyle: danger, warning, success, info
		setInterval(self._fakeProgress, 3000);
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
				<Alert className="fadeInDown" bsStyle='danger'>
					<strong>Holy danger!</strong> Best check yo self, youre not looking too good.
				</Alert>
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





