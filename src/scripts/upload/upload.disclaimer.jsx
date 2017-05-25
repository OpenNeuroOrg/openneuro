// dependencies -------------------------------------------------------

import React   from 'react';
import actions from './upload.actions.js';

export default class Disclaimer extends React.Component {

// life cycle events --------------------------------------------------

    render () {
        return (
            <div>
                <span className="message fade-in error">
                    By uploading this dataset to OpenNeuro I agree to the following conditions:
                    I am the owner of this dataset and have any necessary ethics permissions to share the data publicly.
                    This dataset does not include any identifiable personal health information as defined by the Health 
                    Insurance Portability and Accountability Act of 1996 (including names, zip codes, dates of birth, 
                    acquisition dates, facial features on structural scans etc.).
                    I agree that this dataset and results of all analyses performed on it using the OpenNeuro platform will 
                    become publicly available under a Creative Commons CC0 (“no rights reserved”) license after a grace period of 18 months counted from first successful analysis of data from more than one participant.
                </span>
                <button className="btn-blue" onClick={actions.resumeUpload}>Continue</button>
            </div>
        );
    }

}