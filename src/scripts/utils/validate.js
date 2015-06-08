// dependencies -------------------------------------------------------------------

import {JSHINT}  from 'jshint';
import async     from 'async';
import fileUtils from './files';

// public API ---------------------------------------------------------------------

let validate = {
    BIDS,
    JSON
};

export default validate;

// implementations ----------------------------------------------------------------

function BIDS (fileList, callback) {
    for (let key in fileList) {
        let file = fileList[key];

        
    }
    let errors = [];
    async.forEachOf(fileList, function (file, key, cb) {

        // validate tsv
        if (file.name && file.name.indexOf('.tsv') > -1) {
            //console.log(file.name);
            return cb();
        }

        // validate json
        if (file.name && file.name.indexOf('.json') > -1) {
            validate.JSON(file, function (err) {
                if (err) {
                    errors.push({file: file, errors: err})
                }
                cb();
            });
        } else {
            cb();
        }
    
    }, function () {
        callback(errors);
    });
}

function JSON (file, callback) {
    fileUtils.read(file, function (contents) {
        if (!JSHINT(contents)) {
            var out = JSHINT.data(),
            errors = out.errors;
            callback(errors);

        } else {
            callback(null);
        }
    });
}