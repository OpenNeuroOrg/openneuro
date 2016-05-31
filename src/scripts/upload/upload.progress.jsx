// dependencies -----------------------------------------------------------

import React from 'react';
import {ProgressBar} from 'react-bootstrap';

// component setup --------------------------------------------------------

export default class UploadProgress extends React.Component {

// life cycle events ------------------------------------------------------

    render () {
        let minimal = this.props.minimal;

        // resume
        let resume     = this.props.resume,
            rCompleted = resume.completed,
            rTotal     = resume.total,
            rProgress  = rTotal > 0 ? Math.floor(rCompleted / rTotal * 100) : 0;

        // upload
        let upload     = this.props.upload,
            uCompleted = upload.completed,
            uTotal     = upload.total;
        if (this.props.resumeStart) {
            let resumeStart = this.props.resumeStart;
            rProgress  = rProgress * (resumeStart / uTotal);
            uCompleted = uCompleted - resumeStart;
        }
        let uProgress  = uTotal > 0 ? Math.floor(uCompleted / uTotal * 100) : 0;

        return (
            <div className="upload-progress-block">
                {this._progressText(this.props.name, this.props.upload.completed, uTotal, minimal)}
                <ProgressBar>
                    <ProgressBar active bsStyle="warning" now={rProgress} key={1} label={!minimal ? 'resuming'  : null} />
                    <ProgressBar active bsStyle="success" now={uProgress} key={2} label={!minimal ? 'uploading' : null} />
                </ProgressBar>
                {this._currentFiles(upload.currentFiles, minimal)}
            </div>
        );
    }

// template methods -------------------------------------------------------

    _currentFiles(files, minimal) {
        if (!minimal) {
            let currentFiles = files.map((file, index) => {
                return (
                    <div className="ellipsis-animation" key={index}>
                        {file}
                        <span className="one">.</span>
                        <span className="two">.</span>
                        <span className="three">.</span>
                    </div>
                );
            });
            return <div className="uploadfiles-wrap">{currentFiles}</div>;
        }
    }

    _progressText(name, completed, total, minimal) {
        if (!minimal) {
            return (
                <span className="upload-dirname">
                    <label><i className="folderIcon fa fa-folder-open" /></label>
                    {name}
                    <span className="message fade-in"> {completed}/{total} files complete</span>
                </span>
            );
        }
    }

}

UploadProgress.propTypes = {
    upload:      React.PropTypes.object,
    resume:      React.PropTypes.object,
    resumeStart: React.PropTypes.number,
    name:        React.PropTypes.string,
    minimal:     React.PropTypes.bool
};

UploadProgress.Props = {
    upload:      {},
    resume:      {},
    resumeStart: 0,
    name:        '',
    minimal:     false
};