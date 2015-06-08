// dependencies -------------------------------------------------------

import React     from 'react';
import fileUtils from '../../utils/files';

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

	_validate: function (e) {
        for (let key in this.props.list) {
            let file = this.props.list[key];

            // validate tsv
            if (file.name && file.name.indexOf('.tsv') > -1) {
                //console.log(file.name);
            }

            // validate json
            if (file.name && file.name.indexOf('.json') > -1) {
                fileUtils.read(file, function (contents) {
                    //console.log(contents);
                    try {
                        JSON.parse(contents);
                    }
                    catch (err) {
                        console.log(err);
                        console.log('file: ' + file.name);
                        console.log('error: ' + err.message);
                    }
                });
            }
        }
	}

});

export default Validator;