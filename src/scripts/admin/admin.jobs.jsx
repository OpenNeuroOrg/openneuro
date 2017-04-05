// dependencies -------------------------------------------------------

import React      from 'react';
import Reflux     from 'reflux';
import adminStore from './admin.store';
import actions    from './admin.actions';
import WarnButton from '../common/forms/warn-button.jsx';
import DefineJobModal       from './admin.create-job.modal.jsx';

let Jobs = React.createClass({

    mixins: [Reflux.connect(adminStore)],

// life cycle events --------------------------------------------------

    render() {
        let noBlacklist = <div className="no-results">There are no blocked users</div>;

        return (
            <div className="dashboard-dataset-teasers fade-in inner-route admin-blacklist clearfix">
                <h2>Job Definitions</h2>
                <button className="btn-blue" onClick={actions.toggleModal.bind(this, 'defineJob')} >
                    <span>Define a Job</span>
                </button>
                <div>
                    List of job definitions.
                </div>
                <DefineJobModal show={this.state.modals.defineJob} onHide={actions.toggleModal.bind(this, 'defineJob')} />
            </div>
        );
    }

});

export default Jobs;
