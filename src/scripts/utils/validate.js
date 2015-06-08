// dependencies -------------------------------------------------------------------

var jshint = require("jshint").JSHINT;
import fileUtils from './files';

// public API ---------------------------------------------------------------------

let validate = {
    BIDS
};

export default validate;

// implementations ----------------------------------------------------------------

function BIDS (fileList) {
    for (let key in fileList) {
        let file = fileList[key];

        // validate tsv
        if (file.name && file.name.indexOf('.tsv') > -1) {
            //console.log(file.name);
        }

        // validate json
        if (file.name && file.name.indexOf('.json') > -1) {
            JSON(file);
        }
    }
}

function JSON (file) {
    fileUtils.read(file, function (contents) {
        if (!jshint(contents)) {
            var out = jshint.data(),
            errors = out.errors;

            // log errors 
            console.log('/***************************************************************/');
            console.log(file.name);
            console.log(file.webkitRelativePath);
            for(var j=0;j<errors.length;j++) {
                if (errors[j]){
                    console.log(errors[j].reason + 'at line: ' + errors[j].line + ' character: ' + errors[j].character +  ' -> ' + errors[j].evidence);
                }
            }
            console.log('/***************************************************************/');
        }
    });
}