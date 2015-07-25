// dependencies -------------------------------------------------------

import React     from 'react';
import pluralize from 'pluralize';
import DirUpload from './dirUpload.component.jsx';
import DirTree   from './dirTree.component.jsx';
import UploadAlert   from '../common/partials/alert.component.jsx';
import validate  from 'bids-validator';
import scitran   from '../utils/scitran';
import files     from '../utils/files';
import DirValidationMessages from './dirValidationMessages.component.jsx';
import {PanelGroup, Accordion, Panel, ProgressBar} from 'react-bootstrap';

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
			progress: {total: 0, completed: 0}
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
		let warningCount = pluralize('Warning', totalWarnings);
		let errorCount = pluralize('Error', totalErrors);
		let warningFilesCount = pluralize('File', warnings.length);
		let errorFilesCount = pluralize('File', errors.length);
		let progress = this.state.progress.total > 0 ? this.state.progress.completed / this.state.progress.total * 100 : 0;
		//Error Log
		let errors_waringings = errors.concat(warnings);
		let errorLog = JSON.stringify(errors_waringings);
		let errorURL = "data:application/octet-stream;charset=utf-8,"+dirName+'_Errors'+encodeURIComponent(errorLog);
		let errorsFilename = dirName+"_errors.json"
		let errorLink = <a download={errorsFilename} className="error-log" target="_blank" href={errorURL}>Download error log for {dirName}</a>;
		//errors
		let errorHeader = <span>{totalErrors} {errorCount} in {errors.length} {errorFilesCount}</span>;
		let errorsWrap = (
			<Panel className="fadeInDown upload-panel error-wrap" header={errorHeader}  eventKey='1'>
				<DirValidationMessages issues={errors} /> 
			</Panel>
		);
		//warnings
		let warningHeader = <span>{totalWarnings} {warningCount} in {warnings.length} {warningFilesCount}</span>;
		let warningWrap = (
			<Panel className="fadeInDown upload-panel warning-wrap" header={warningHeader}  eventKey='2'>
				<DirValidationMessages issues={warnings} />
			</Panel>
		);
		// validations errors and warning wraps
		let validationMessages =(
			<Accordion className="validation-messages" accordion>
				{errors.length > 0 ? errorsWrap : null}
				{warnings.length > 0 ? warningWrap : null}
			</Accordion>
		)
		// Visual representation of directory Tree 
		let uploadFileStructure = (
			<span>
				{errorLink}
				<Accordion className="fileStructure fadeIn">
					<Panel header="View File Structure" eventKey='1'>
				  		<DirTree tree={tree}/>
				  	</Panel>
			  	</Accordion>
			 </span>
		);
		//messages
		let initialMessage = <span className="message fadeIn">Upload a BIDS dataset.<br/> <small><a href="#">Click to view details on BIDS specification</a></small></span>;
		let warningsMessage = <span className="message error fadeIn">We found {totalWarnings} {warningCount} in your dataset. Proceed with this dataset by clicking continue or fix the issues and upload again.</span>;
		let errorMessage = (
			<span className="message error fadeIn">Your dataset is not a valid BIDS dataset. Fix the <strong>{totalErrors} {errorCount}</strong> and upload your dataset again.<br/> 
				<small><a href="#">Click to view details on BIDS specification</a></small>
			</span>
		);
		let uploadingMessage = <span className="message fadeIn">Uploading {Math.floor(progress)}%</span>;
	 	//buttons 
		let withWarningsBtn = (
			<div className="validate-buttons">
				<button onClick={this._upload} className="continueWarning btn-blue">Continue</button>
			</div>
		);

		// Main Elements
		let messages = (
			<span>
				{!this.state.uploadState && tree.length === 0 && errors.length === 0 ? initialMessage : null }
				{tree.length > 0 && errors.length === 0 && warnings.length > 0 ? warningsMessage : null}
				{tree.length > 0 && errors.length > 0 ? errorMessage : null}
			</span>
		)
		let buttons = (
			<div className="warning-btn-group clearfix" role="group" aria-label="...">
				<DirUpload onChange={self._onChange} />
				 {withWarningsBtn}
			</div>
		);
		let dirHeader = (
			<h3 className="dir-name">
				<i className="folderIcon fa fa-folder-open" /> 
				{dirName}
			</h3>
		);
		
		let progress_upload = (
			<div className="uploadbar">
				{dirHeader}
				{uploadingMessage}
				<ProgressBar active now={progress} />
			</div>
		);

		let uploadAccordion = (
			<PanelGroup className="upload-accordion" defaultActiveKey='1' accordion>
				<Panel className="upload-panel" header='Upload Dataset' eventKey='1'>
					<div>
						<div className="upload-wrap">
								{tree.length > 0 && errors.length === 0 && warnings.length > 0 ? buttons : <DirUpload onChange={self._onChange} /> }
								{tree.length > 0 ? dirHeader : null}
								{messages}
						</div>
						{tree.length > 0 ? validationMessages : null}
						{tree.length > 0 ? uploadFileStructure : null}
					</div>
				</Panel>
			</PanelGroup>
		);
		return (
			<div className={this.state.uploadState ? 'right-sidebar uploading' : 'right-sidebar'}>
				<div className="upload-nav">
					<h2>My Tasks</h2>
				</div>
				{this.state.alert ? <UploadAlert /> : null}
				{uploadAccordion}
				{progress_upload}
			</div>
    	);
	},

// custom methods -----------------------------------------------------

	/**
	 * On Change
	 *
	 * On file select this adds files to the state
	 * and starts validation.
	 */
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

	/**
	 * Validate
	 *
	 * Takes a filelist, runs BIDS validation checks
	 * against it, and sets any errors to the state.
	 */
	_validate (fileList) {
		let self = this;

        validate.BIDS(fileList, function (errors, warnings) {
        	errors   = errors   ? errors   : [];
        	warnings = warnings ? warnings : [];

        	let totalErrors = 0;  
        	let totlalWarnings = 0;
			for (let error   of errors)   {totalErrors    += error.errors.length;}
            for (let warning of warnings) {totlalWarnings += warning.errors.length;}

			self.setState({
				errors: errors,
				totalErrors: totalErrors,
				warnings: warnings,
				totalWarnings: totlalWarnings
			});

			if (errors.length === 0) {
				if (warnings.length === 0) {
					self._upload();
					self.setState({uploadState: true});
				}
			}
        });
	},

	/**
	 * Upload
	 *
	 * Uploads currently selected and triggers
	 * a progress event every time a file or folder
	 * finishes.
	 */
	_upload () {
		let self = this;
		let count = files.countTree(this.state.tree);

		scitran.upload(this.state.tree, count, function (progress) {
			self.setState({
				progress: progress,
				uploadState: true
			});
			 if(progress.total === progress.completed){
				self.setState({
					tree: [],
					list: {},
					errors: [],
					warnings: [],
					dirName: '',
					alert: true,
					uploadState: false,
					validating: false,
					totalErrors: 0,
					totalWarnings: 0,
					progress: {total: 0, completed: 0}
				});
				setTimeout(function(){ self.setState({alert: false}) }, 3000);
			}
		});
	}

});


export default Upload;





