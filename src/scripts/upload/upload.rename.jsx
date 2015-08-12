// dependencies -------------------------------------------------------

import React       from 'react';
import Reflux      from 'reflux';
import Actions     from './upload.actions.js';
import UploadStore from './upload.store.js';
import Input       from '../common/forms/input.component.jsx';

let Rename = React.createClass({

	mixins: [Reflux.connect(UploadStore)],

// life cycle events --------------------------------------------------

	render () {
		let dirName      = this.state.dirName;

		return (
			<div>
				<label className="add-name"><i className="folderIcon fa fa-folder-open" /></label>
				<Input type="text" placeholder="dataset name" value={dirName} onChange={this._updateDirName} />
				<button onClick={this._validate.bind(null, this.state.list)}>Continue</button>
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