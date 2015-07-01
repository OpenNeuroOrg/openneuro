// dependencies -------------------------------------------------------

import React     from 'react'
import DirUpload from './dirUpload.component.jsx';
import DirTree   from './dirTree.component.jsx';
import validate  from 'bids-validator';
import scitran   from '../utils/scitran';
import DirValidationMessages from './dirValidationMessages.component.jsx';
import { Accordion, Panel } from 'react-bootstrap';

let Upload = React.createClass({

// life cycle events --------------------------------------------------

	getInitialState () {
		return {
			tree: [],
			list: {},
			errors: [],
			dirName: '',
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
		
		let dirValidBtns = (
			<div className="validate-buttons">
				<button onClick={self._validate.bind(null, list)}>Validate</button>
				<button onClick={self._upload}>Upload</button>
		   		<span>
		   			Validating <i className="fa fa-circle-o-notch fa-spin" />
		   		</span>
			</div>
		);

		let dirHeader = (
			<h3 className="clearfix">
		   		<span className="dirName">
			   		<i className="folderIcon fa fa-folder-open" /> 
			   		{dirName}
		   		</span> 
			</h3>
		);

		let dirMeta = (
			<span>
				{dirValidBtns}
				{dirHeader}
				<span>Fix the {errors.length} Errors and Validate your Dataset Again to Continue</span>
			   	<Accordion className="fileStructure">
    				<Panel header={<i className="fa fa-chevron-down"> See File Structure</i> } eventKey='1'>
				  		<DirTree tree={tree}/>
				  	</Panel>
			  	</Accordion>
			</span>
		);
		return (
			<div className="col-xs-12">
				<div className="upload-wrap">
					<DirUpload onChange={self._onChange} />
					{tree.length > 0 ? dirMeta : null}
				</div>
				<div className="error-wrap">
					{tree.length > 0 ? <DirValidationMessages errors={errors} /> : null}
				</div>
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
		});

		this._validate(files.list);
	},

	_validate: function (fileList) {
		let self = this;
        validate.BIDS(fileList, function (errors) {
            self.setState({errors: errors});
        });
	},

	_upload () {
		scitran.upload(this.state.tree);
	}

});


export default Upload;





