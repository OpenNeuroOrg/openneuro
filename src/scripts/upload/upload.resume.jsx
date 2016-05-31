// dependencies -------------------------------------------------------

import React   from 'react';
import actions from './upload.actions.js';

export default class Resume extends React.Component {

// life cycle events --------------------------------------------------

    render () {
        return (
            <div>
                <span className="message fade-in error">
                    You have already uploaded a dataset with this name. Click continue to resume an unfinished upload or <span className="rename-tab-link" onClick={actions.selectTab.bind(null, 2)}>choose another name.</span>
                </span>
                <button className="btn-blue" onClick={actions.resumeUpload}>Continue</button>
            </div>
        );
    }

}