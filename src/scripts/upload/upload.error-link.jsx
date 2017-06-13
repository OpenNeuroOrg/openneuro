// dependencies -----------------------------------------------------------

import React from 'react';

// component setup --------------------------------------------------------

export default class ErrorLink extends React.Component {

// life cycle events ------------------------------------------------------

    render () {
        let errors = this.props.errors;
        let warnings = this.props.warnings;
        if (errors === 'Invalid' || (errors.length < 1 && warnings.length < 1)) {return false;}

        let dataURL = this._generateErrorLog(errors, warnings);
        return (
            <a download={this.props.dirName + '_errors.txt'} className="error-log" target="_blank" href={dataURL}>
                Download error log for {this.props.dirName}
            </a>
        );
    }

// custom methods ---------------------------------------------------------

    /**
     * Generate Error Log
     *
     * Takes an array of errors and an array of
     * warnings and returns text error log encoded
     * as a url.
     */
    _generateErrorLog (errors, warnings) {
        let issueString = this._generateIssueLog(errors, 'Error');
        issueString    += this._generateIssueLog(warnings, 'Warning');
        let errorURL    = 'data:application/octet-stream;charset=utf-8,' + encodeURIComponent(issueString);
        return errorURL;
    }

    /**
     * Generate Issue Log
     *
     * Takes an array of issues and a string of the
     * issue type and return a human readable log
     * of the issues as a string.
     */
    _generateIssueLog (issues, type) {
        let issueString = '';
        let endLine = '======================================================';
        for (var i = 0; i < issues.length; i++) {
            issueString += 'File Path: ' + issues[i].reason + '\n\n';
            for (var j = 0; j < issues[i].files.length; j++) {
                var file = issues[i].files[j];
                issueString += '\tType:\t\t' + type + '\n';
                if (!file) {continue;}
                if (file.file.name)    {issueString += '\tFile:\t\t' + file.file.name + '\n';}
                if (file.file.webkitRelativePath)    {issueString += '\tLocation:\t\t' + file.file.webkitRelativePath + '\n';}
                if (file.reason)    {issueString += '\tReason:\t\t' + file.reason + '\n';}
                if (file.line)      {issueString += '\tLine:\t\t' + file.line + '\n';}
                if (file.character) {issueString += '\tCharacter:\t' + file.character + '\n';}
                if (file.evidence)  {issueString += '\tEvidence:\t' + file.evidence + '\n\n';}
            }
            issueString += '\n' + endLine +'\n\n\n';
        }
        return issueString;
    }
}

ErrorLink.propTypes = {
    errors:React.PropTypes.oneOfType([React.PropTypes.array,React.PropTypes.string]),
    warnings:React.PropTypes.array,
    dirName:React.PropTypes.string
};
