// dependencies -----------------------------------------------------------

import React from 'react';
import {ProgressBar} from 'react-bootstrap';

// component setup --------------------------------------------------------

export default class UploadProgress extends React.Component {

// life cycle events ------------------------------------------------------

    render () {
        // resume
        let rCompleted = this.props.resume.completed;
        let rTotal     = this.props.resume.total;
        let rProgress  = rTotal > 0 ? Math.floor(rCompleted / rTotal * 100) : 0;

        // upload
        let uCompleted = this.props.upload.completed;
        let uTotal     = this.props.upload.total;
        if (this.props.resumeStart) {
            let resumeStart = this.props.resumeStart;
            rProgress = rProgress * (resumeStart / uTotal);
            uCompleted = uCompleted - resumeStart;
            uTotal     = uTotal - resumeStart;
        }
        let uProgress  = uTotal > 0 ? Math.floor(uCompleted / uTotal * 100) : 0;

        let currentFiles = this.props.upload.currentFiles.map(function (file, index) {
            return (
                <div className="ellipsis-animation" key={index}>
                    {file}
                    <span className="one">.</span>
                    <span className="two">.</span>
                    <span className="three">.</span>​
                </div>
            );
        });

        return (
            <div className="upload-progress-block">
                <span className="upload-dirname">
                    <label><i className="folderIcon fa fa-folder-open" /></label>
                    {this.props.name}
                    <span className="message fade-in"> {rCompleted + uCompleted}/{rTotal + uTotal} files complete</span>

                </span>
                <ProgressBar>
                    <ProgressBar active bsStyle="warning" now={rProgress} key={1} />
                    <ProgressBar active bsStyle="success" now={uProgress} key={2}/>
                </ProgressBar>
                <div className="uploadfiles-wrap">
                    {currentFiles}
                </div>
            </div>
        );
    }

}

UploadProgress.propTypes = {
    progress: React.PropTypes.object,
    name:   React.PropTypes.string
};

UploadProgress.Props = {
    progress: {}
};