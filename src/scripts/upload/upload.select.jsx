// dependencies -------------------------------------------------------

import React       from 'react';
import FileSelect  from './upload.file-select.jsx';
import Actions     from './upload.actions.js';

let Select = React.createClass({

// life cycle events --------------------------------------------------

	render () {

		return (
			<div>
				<span className="message fadeIn">Select a  <a href="http://bids.neuroimaging.io" target="_blank">BIDS dataset</a> to upload</span>
				<FileSelect onChange={this._onChange}/>
			</div>
    	);
	},

// custom methods -----------------------------------------------------

	_onChange: Actions.onChange

});


export default Select;