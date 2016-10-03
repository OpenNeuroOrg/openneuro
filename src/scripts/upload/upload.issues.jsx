// dependencies -------------------------------------------------------

import React       from 'react';
import pluralize   from 'pluralize';
import actions     from './upload.actions.js';
import Results     from './upload.validation-results.jsx';
import Spinner     from '../common/partials/spinner.jsx';
import ErrorLink   from './upload.error-link.jsx';

let Issues = React.createClass({

// life cycle events --------------------------------------------------
    propTypes: {
        tree:React.PropTypes.array,
        errors:React.PropTypes.array,
        warnings:React.PropTypes.array,
        dirName:React.PropTypes.string,
        uploadStatus:React.PropTypes.string
    },

    render () {
        // short references
        let tree     = this.props.tree;
        let errors   = this.props.errors;
        let warnings = this.props.warnings;
        let dirName  = this.props.dirName;
        let uploadResetLink;
        if (errors.length > 0 || warnings.length > 0) {
            uploadResetLink = <button className="btn-blue" onClick={this._reset}>select folder</button>;;
        }
        // results
        let results = (
            <div>
                {this._message(errors, warnings)}
                <Results errors={errors} warnings={warnings} />
                {errors.length === 0 ? <button className="btn-blue" onClick={actions.checkExists.bind(null, tree, false)}>Continue</button> : null}
                {uploadResetLink}
                <ErrorLink dirName={dirName} errors={errors} warnings={warnings} />
                <span className="bids-link">Click to view details on <a href="http://bids.neuroimaging.io" target="_blank">BIDS specification</a></span>
            </div>
        );

        return (
            <div>
                {this.props.uploadStatus === 'validating' ? <Spinner text="validating" active={true}/> : results}
            </div>
        );
    },

// template methods ---------------------------------------------------

    _message(errors, warnings) {
        // counts
        let totalErrors   = 0;
        let totalWarnings = 0;
        let warningCount,
            errorCount;
        if (errors !== 'Invalid') {
            totalErrors   = errors.length;
            totalWarnings = warnings.length;
            warningCount  = totalWarnings + ' ' + pluralize('Warning', totalWarnings);
            errorCount    = totalErrors   + ' ' + pluralize('Error', totalErrors);
        }

        // messages
        if (errors === 'Invalid') {
            return <span className="message error fade-in">This does not appear to be a BIDS dataset. <span className="upload-reset-link" onClick={this._reset}>Select a new folder</span> and try again.</span>;
        } else if (errors.length > 0) {
            return <span className="message error fade-in">Your dataset is not a valid BIDS dataset. Fix the <strong>{errorCount}</strong> and select your folder again.</span>;
        }  else if (warnings.length > 0) {
            return <span className="message error fade-in">We found {warningCount} in your dataset. You are not required to fix warnings, but doing so will make your dataset more BIDS compliant. Continue or fix the issues and select folder again.</span>;
        } else {
            return <span className="message fade-in">Proceed with this dataset by clicking continue or <span className="upload-reset-link" onClick={this._reset}>select your folder again</span>.</span>;
        }
    },

// actions ------------------------------------------------------------

    _reset () {
        actions.selectTab(1);
        document.getElementById("multifile-select").click();
    }

});


export default Issues;