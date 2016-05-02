// dependencies -------------------------------------------------------

import React   from 'react';
import Reflux  from 'reflux';
import Status  from '../common/partials/status.jsx';
import UploadStore   from '../upload/upload.store.js';

let Statuses = React.createClass({

    mixins: [Reflux.connect(UploadStore)],

// life cycle events --------------------------------------------------

    getDefaultProps() {
        return {
            minimal: false
        };
    },

    propTypes: {
        dataset: React.PropTypes.object,
        minimal: React.PropTypes.bool
    },

    render() {
        let dataset   = this.props.dataset,
            minimal   = this.props.minimal,
            status    = dataset.status,
            uploading = dataset._id === this.state.projectId;

        return (
            <span className="clearfix status-wrap">
                <Status type='public'     minimal={minimal} display={status.public} />
                <Status type='incomplete' minimal={minimal} display={status.incomplete && !uploading} dataset={dataset} />
                <Status type='shared'     minimal={minimal} display={status.shared} />
                <Status type='inProgress' minimal={minimal} display={uploading} />
                <Status type='invalid'    minimal={minimal} display={status.invalid} />
            </span>
        );
    }

});

export default Statuses;