// dependencies -----------------------------------------------------------

import React from 'react';
import {ProgressBar} from 'react-bootstrap';

// component setup --------------------------------------------------------

export default class UploadProgress extends React.Component {

// life cycle events ------------------------------------------------------

    render () {
        let minimal   = this.props.minimal,
            progress  = this.props.progress,
            completed = progress.completed,
            total     = progress.total,
            percent   = total > 0 ? Math.floor(completed / total * 100) : 0;

        return (
            <div className="upload-progress-block">
                {this._progressText(this.props.name, progress, minimal)}
                <ProgressBar active bsStyle="success" now={percent} key={2} label={!minimal ? progress.status : ''} />
                {this._currentFiles(progress.currentFiles, minimal)}
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

    _progressText(name, progress, minimal) {
        if (!minimal) {
            return (
                <span className="upload-dirname">
                    <label><i className="folderIcon fa fa-folder-open" /></label>
                    {name}
                    <span className="message fade-in"> {progress.completed}/{progress.total} files complete</span>
                </span>
            );
        }
    }

}

UploadProgress.propTypes = {
    progress: React.PropTypes.object,
    name:     React.PropTypes.string,
    minimal:  React.PropTypes.bool
};

UploadProgress.Props = {
    progress: {},
    name:     '',
    minimal:  false
};