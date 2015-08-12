// dependencies -------------------------------------------------------

import React       from 'react';
import FileSelect  from './upload.file-select.jsx';
import Actions     from './upload.actions.js';

let Select = React.createClass({

// life cycle events --------------------------------------------------

	render () {

		return (
			<FileSelect onChange={this._onChange}/>
    	);
	},

// custom methods -----------------------------------------------------

	_onChange: Actions.onChange

});


export default Select;