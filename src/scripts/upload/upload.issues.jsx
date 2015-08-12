// dependencies -------------------------------------------------------

import React       from 'react';
import Reflux      from 'reflux';
import Actions     from './upload.actions.js';
import UploadStore from './upload.store.js';
import Results     from './upload.validation-results.jsx';

let Issues = React.createClass({

	mixins: [Reflux.connect(UploadStore)],

// life cycle events --------------------------------------------------

	render () {
		let tree         = this.state.tree;
		let errors       = this.state.errors;
		let warnings     = this.state.warnings;

		return (
			<div>
				<Results errors={errors} warnings={warnings} />
				<button onClick={this._upload.bind(null, tree)}>Continue</button>
			</div>
    	);
	},

// custom methods -----------------------------------------------------

	_upload: Actions.upload

});


export default Issues;