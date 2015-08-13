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
				<span className="message fadeIn">You have already uploaded a dataset with this name. Click "resume" if you are trying to resume an unfinished upload.</span>
				<button className="btn-blue" onClick={this._upload.bind(null, this.state.tree)}>Resume</button>
			</div>
    	);
	},

// custom methods -----------------------------------------------------

	_upload: Actions.upload

});


export default Resume;