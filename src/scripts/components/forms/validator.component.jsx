// dependencies -------------------------------------------------------

import React     from 'react';
import validate from '../../utils/validate';

let Validator = React.createClass({

    propTypes: {
        list: React.PropTypes.object,
    },

// life cycle events --------------------------------------------------

	render: function () {
		let self = this;
		return (
			<button onClick={self._validate}>Validate</button>
    	);
	},

// custom methods -----------------------------------------------------

	_validate: function () {
        validate.BIDS(this.props.list, function (errors) {
            console.log(errors);
        });
	}

});

export default Validator;