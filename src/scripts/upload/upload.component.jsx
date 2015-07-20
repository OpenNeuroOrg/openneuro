// dependencies -------------------------------------------------------

import React     from 'react'
import DirUpload from './dirUpload.component.jsx';
import DirTree   from './dirTree.component.jsx';
import validate  from 'bids-validator';
import scitran   from '../utils/scitran';
import DirValidationMessages from './dirValidationMessages.component.jsx';
import WarningValidationMessages from './warningValidationMessages.component.jsx';
import { PanelGroup, Accordion, Panel } from 'react-bootstrap';

let Upload = React.createClass({

// life cycle events --------------------------------------------------

	getInitialState () {
		return {
			tree: [],
			list: {},
			errors: [],
			warnings: [],
			dirName: '',
			alert: false,
			uploadState: false,
			validating: false,
			totalErrors: 0,
			totalWarnings: 0,
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
		let warnings = this.state.warnings;
		let dirName = this.state.dirName;
		let totalErrors = self.state.totalErrors;
		let totalWarnings = self.state.totalWarnings;

		//Error Log
		let errors_waringings = errors.concat(warnings);
		let errorLog = JSON.stringify(errors_waringings);
		let errorURL = "data:application/octet-stream;charset=utf-8,"+dirName+'_Errors'+encodeURIComponent(errorLog);
		let errorsFilename = dirName+"_errors.json"
		let errorLink = <a download={errorsFilename} className="error-log" target="_blank" href={errorURL}>Download error log for {dirName}</a>;
		
		// Visual representation of directory Tree 
		let uploadFileStructure = (
				<span>
					{errorLink}
					<Accordion className="fileStructure fadeIn">
						<Panel header="See File Structure" eventKey='1'>
					  		<DirTree tree={tree}/>
					  	</Panel>
				  	</Accordion>
				 </span>
		);
		//messages
		let initialMessage = <span className="message fadeIn">Upload a BIDS dataset.<br/> <small><a href="#">Click to view details on BIDS specification</a></small></span>;
		// if no errors
		let withWarnings = (
			<span className="no-errors-warnings">
				<div className="validate-buttons">
					<button onClick={self._upload} className="btn-blue"><i className=""></i> Upload</button>
				</div>
				<h3 className="dir-name">
					<i className="folderIcon fa fa-folder-open" /> 
			   		{dirName}
				</h3>
				<span className="message error fadeIn">We found {totalWarnings} Warnings in your dataset. Proceed with this dataset by clicking continue or fix the issues and upload again.</span>
			</span>
		);
		//if errors
		let uploadMeta = (
			<span>
				<h3 className="dir-name">
					<i className="folderIcon fa fa-folder-open" /> 
			   		{dirName}
				</h3>
				<span className="message error fadeIn">
					Your dataset is not a valid BIDS dataset. Fix the <strong>{totalErrors} Errors</strong> and upload your dataset again.
					<br/> 
					<small><a href="#">Click to view details on BIDS specification</a></small>
				</span>
			</span>
		);
		//Buttons, messages, and conditional depending on state
		let uploadHeader =(
			<div className="upload-wrap">
				<span className={this.state.uploadState ? 'upload' : null }>
					<DirUpload onChange={self._onChange} />
					{!this.state.uploadState && errors.length === 0 ? initialMessage : null }
					{errors.length === 0 ? withWarnings : null}
					{tree.length > 0 && errors.length > 0 ? uploadMeta : null}
				</span>
			</div>
		);
		//errors
		let errorHeader = <span>{totalErrors} Errors in {errors.length} files</span>;
		let errorsWrap = (
			<Panel className="fadeInDown upload-panel error-wrap" header={errorHeader}  eventKey='1'>
				<DirValidationMessages errors={errors} /> 
			</Panel>
		);
		//warnings
		let warningHeader = <span>{totalWarnings} Warnings in {warnings.length} files</span>;
		let warningWrap = (
			<Panel className="fadeInDown upload-panel warning-wrap" header={warningHeader}  eventKey='2'>
				<WarningValidationMessages warnings={warnings} />
			</Panel>
		);

		let validationMessages =(
			<Accordion className="validation-messages" accordion>
					{errors.length > 0 ? errorsWrap : null}
					{warnings.length > 0 ? warningWrap : null}
				</Accordion>
		)


		return (
			<div className="right-sidebar">
				<div className="upload-nav"><h2>My Tasks</h2></div>
					<PanelGroup className="upload-accordion" defaultActiveKey='1' accordion>
					<Panel className="upload-panel" header='Upload Dataset' eventKey='1'>
						<div className={this.state.validating ? 'ua-body validating' : 'ua-body'}>
							{uploadHeader}
							{tree.length > 0 ? validationMessages : null}
							{tree.length > 0 ? uploadFileStructure : null}
						</div>
					</Panel>
				</PanelGroup>
			</div>
    	);
	
	},

// custom methods -----------------------------------------------------

//need to add after upload is ready 

	_onChange (files) {
		let self = this;
		this.setState({
			tree: files.tree,
			list: files.list,
			dirName: files.tree[0].name,
			validating: !self.state.validating,
		});

		this._validate(files.list);

	},
	_validate: function (fileList) {
		let self = this;

        validate.BIDS(fileList, function (errors, warnings) {
        	console.log(warnings)
        	let adderTotalErrors = 0;  
        	let adderTotlalWarnings = 0;    
        	//Set errors and warnings
			self.setState({errors: errors});   
			self.setState({warnings: warnings});    

            //get warning totals
            for(let i = 0; i< warnings.length; i++){
            	adderTotlalWarnings  += warnings[i].errors.length;
			}
 			//get error totals
			for(let i = 0; i< errors.length; i++){
            	adderTotalErrors  += errors[i].errors.length;
			}

			self.setState({totalErrors: adderTotalErrors});
			self.setState({totalWarnings: adderTotlalWarnings});
			if(errors.length === 0){
				self.setState({
					uploadState: !self.state.uploadState
				});
			}
        });


	},

	_upload () {
		scitran.upload(this.state.tree);
	}

});


export default Upload;





