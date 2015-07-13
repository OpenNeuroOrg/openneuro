// dependencies -------------------------------------------------------

import React     from 'react'
import DirUpload from './dirUpload.component.jsx';
import DirTree   from './dirTree.component.jsx';
import validate  from 'bids-validator';
import scitran   from '../utils/scitran';
import DirValidationMessages from './dirValidationMessages.component.jsx';
import { PanelGroup, Accordion, Panel } from 'react-bootstrap';

let Upload = React.createClass({

// life cycle events --------------------------------------------------

	getInitialState () {
		return {
			tree: [],
			list: {},
			errors: [],
			dirName: '',
			alert: false,
			uploadState: false,
			validating: false,
			fileStructure: false,
			totalErrors: 0
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
		let totalErrors = self.state.totalErrors;
				
		let uploading = (
			<div className="validate-buttons">
				<button onClick={self._upload} className="btn-blue"><i className=""></i> Upload</button>
			</div>
		);

		let uploadNavHeader = (
			<h2>
				My Tasks
			</h2>
		);

		let dirNameWrap = (
			<h3 className="dir-name">
		   		<i className="folderIcon fa fa-folder-open" /> 
		   		{dirName}
			</h3>
		);

		let uploadMeta = (
			<span>
				{dirNameWrap}
				<span className="message fadeIn">Your dataset is not a valid BIDS dataset. Fix the <strong>{totalErrors} Errors</strong> and upload your dataset again.<br/> <small><a href="#">Click to view details on BIDS specification</a></small></span>
			</span>
		);
		let initialMessage = <span className="message fadeIn">Upload a BIDS dataset.<br/> <small><a href="#">Click to view details on BIDS specification</a></small></span>;

		let errorHeador =(
			<div className="fadeInUpBig errors-header">{totalErrors} Errors in {errors.length} files</div>
		);

		let uploadFileStructure = (
			<Accordion className="fileStructure fadeInUpBig">
				<Panel header='See File Structure' eventKey='1'>
			  		<DirTree tree={tree}/>
			  	</Panel>
		  	</Accordion>
		);

		return (
			<div className="right-sidebar">
				<div className="upload-nav">{uploadNavHeader}</div>
					<PanelGroup className="upload-accordion" defaultActiveKey='1' accordion>
					<Panel className="upload-panel" header='Upload Dataset' eventKey='1'>
							
						<div className={this.state.validating ? 'ua-body validating' : 'ua-body'}>
							<div className="upload-wrap">
								<span className={this.state.uploadState ? 'upload' : null }>
									<DirUpload onChange={self._onChange} />
									{!this.state.uploadState && errors.length === 0 ? initialMessage : null }
									<br/><button onClick={self._upload}>scitran</button>
									{tree.length > 0 && errors.length > 0 ? uploadMeta : null}
								</span>
							</div>
							<div className="error-wrap">
								{this.state.fileStructure ? uploadFileStructure : null}
								{tree.length > 0 ? errorHeador : null}
								{tree.length > 0 ? <DirValidationMessages errors={errors} /> : null}
							</div>
						</div>
					</Panel>
				</PanelGroup>
			</div>
    	);
	
	},

// custom methods -----------------------------------------------------

//need to add after upload is ready {errors.length === 0 ? uploading : null}

	_onChange (files) {
		let self = this;
		this.setState({
			tree: files.tree,
			list: files.list,
			dirName: files.tree[0].name,
			validating: !self.state.validating,
			fileStructure: !self.state.fileStructure
		});

		this._validate(files.list);

	},

	_validate: function (fileList) {
		let self = this;
        validate.BIDS(fileList, function (errors) {
        	let adderTotalErrors = 0;
            self.setState({errors: errors});
			for(let i = 0; i< errors.length; i++){
				adderTotalErrors  += errors[i].errors.length;
			}
			self.setState({totalErrors: adderTotalErrors});
			if(errors.length === 0){
				self.setState({uploadState: !self.state.uploadState});
			}
        });


	},

	_upload () {
		scitran.upload(this.state.tree);
	}

});


export default Upload;





