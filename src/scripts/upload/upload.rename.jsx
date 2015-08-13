// dependencies -------------------------------------------------------

import React       from 'react';
import Reflux      from 'reflux';
import Actions     from './upload.actions.js';
import UploadStore from './upload.store.js';
import Input       from '../common/forms/input.component.jsx';
import FileTree    from './upload.file-tree.jsx';
import {Accordion, Panel} from 'react-bootstrap';

let Rename = React.createClass({

	mixins: [Reflux.connect(UploadStore)],

// life cycle events --------------------------------------------------

	render () {
		let dirName = this.state.dirName,
			tree    = this.state.tree;

		return (
			<div>
				<span className="message fadeIn">Rename your dataset (optional)</span>
				<div className="dir-name has-input clearfix">
					<label className="add-name"><i className="folderIcon fa fa-folder-open" /></label>
					<Input type="text" placeholder="dataset name" value={dirName} onChange={this._updateDirName} />
				</div>
				<Accordion className="fileStructure fadeIn">
					<Panel header="View File Structure" eventKey='1'>
				  		<FileTree tree={tree}/>
				  	</Panel>
			  	</Accordion>
				<button className="btn-blue" onClick={this._validate.bind(null, this.state.list)}>Continue</button>
			</div>
    	);
	},

// custom methods -----------------------------------------------------

	_updateDirName: function (e) {
		Actions.updateDirName(e.target.value);
	},

	_validate: Actions.validate

});


export default Rename;