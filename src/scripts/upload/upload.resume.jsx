// dependencies -------------------------------------------------------

import React       from 'react';
import Reflux      from 'reflux';
import Actions     from './upload.actions.js';
import UploadStore from './upload.store.js';

let Resume = React.createClass({

	mixins: [Reflux.connect(UploadStore)],

// life cycle events --------------------------------------------------

	render () {
		return (
			<div>
				<span className="message fadeIn error">You have already uploaded a dataset with this name. Click continue to resume an unfinished upload or <span className="rename-tab-link" onClick={this._renameTabLink}>choose another name.</span></span>
				<button className="btn-blue" onClick={this._upload.bind(null, this.state.tree)}>Continue</button>
			</div>
    	);
	},

// custom methods -----------------------------------------------------

	_upload: Actions.upload,
	_renameTabLink: Actions.renameTabLink

});


export default Resume;