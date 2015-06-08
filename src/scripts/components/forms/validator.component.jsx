// dependencies -------------------------------------------------------

import React from 'react';

let Validator = React.createClass({

// life cycle events --------------------------------------------------

	render: function () {
		let self = this;
		return (
			<button onClick={self._validate}>Validate</button>
    	);
	},

// custom methods -----------------------------------------------------

	_validate: function (e) {
        console.log(this.props.list);
        for (let key in this.props.list) {
            let file = this.props.list[key];

            // validate tsv
            if (file.name && file.name.indexOf('.tsv') > -1) {
                console.log(file.name);
            }

            // validate json
            if (file.name && file.name.indexOf('.json') > -1) {
                console.log(file.name);
            }
        }
	}

});

export default Validator;