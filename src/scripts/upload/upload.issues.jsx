// dependencies -------------------------------------------------------

import React       from 'react';
import Reflux      from 'reflux';
import Actions     from './upload.actions.js';
import UploadStore from './upload.store.js';
import Results     from './upload.validation-results.jsx';
import Spinner     from '../common/partials/spinner.component.jsx';

let Issues = React.createClass({

	mixins: [Reflux.connect(UploadStore)],

// life cycle events --------------------------------------------------

	render () {
		let tree         = this.state.tree;
		let errors       = this.state.errors;
		let warnings     = this.state.warnings;


		let specLink        = <span>Click to view details on <a href="http://bids.neuroimaging.io" target="_blank">BIDS specification</a>.</span>;
		let errorMessage    = <span className="message error fadeIn">Your dataset is not a valid BIDS dataset. Fix the  and upload your dataset again.<br/> {specLink}</span>;

		let loading = (
			<Spinner text="validating" active={this.state.uploadStatus === 'validating'}/>
		);

		let results = (
			<div>
				{errors.length > 0 ? errorMessage : null}
				<Results errors={errors} warnings={warnings} />
				{errors.length === 0 ? <button className="btn-blue" onClick={this._upload.bind(null, tree)}>Continue</button> : null}
			</div>
		);

		return (
			<div>
				{this.state.uploadStatus === 'validating' ? loading : results}
			</div>
    	);
	},

// custom methods -----------------------------------------------------

	_upload: Actions.upload

});


export default Issues;