// dependencies -------------------------------------------------------

import React      from 'react';
import Reflux     from 'reflux';
import adminStore from './admin.store';
import actions    from './admin.actions';
import datasetStore from '../dataset/dataset.store';
import WarnButton from '../common/forms/warn-button.jsx';
import DefineJobModal       from './admin.create-job.modal.jsx';

let Jobs = React.createClass({

    mixins: [Reflux.connect(adminStore), Reflux.connect(datasetStore, 'datasets')],

// life cycle events --------------------------------------------------

    render() {
        let noJobs = <div className="no-results">There are no jobs defined.</div>;
        let jobs = Object.keys(this.state.datasets.apps).map((key, index) => {
            let appVersions = this.state.datasets.apps[key];
            let app = appVersions[Math.max(...Object.keys(appVersions))];
            return (
                <div className="fade-in job-panel clearfix" key={key}>
                    <div className="col-xs-5 job-col">
                        <h3>
                            <div className="job-name">
                                <span>{app.jobDefinitionName}</span>:
                                <span>{app.revision}</span>
                            </div>
                        </h3>
                    </div>
                    <div className="col-xs-3 job-col">
                        <div>{app.containerProperties.image}</div>
                    </div>
                    <div className="col-xs-2 job-col">
                        <div>{app.status}</div>
                    </div>
                    <div className="col-xs-2 last dataset-tools-wrap-admin">
                    <div className="tools clearfix">
                        <div className="tool">
                            <WarnButton message="Edit"
                                icon='fa-pencil'
                                warn={false}
                                action={actions.editJobDefinition.bind(this, app)} />
                        </div>
                        <div className="tool">
                            <WarnButton message="Disable"
                                icon='fa-ban'
                                action={actions.disableJobDefinition.bind(this, app)} />
                        </div>
                    </div>
                    </div>
                </div>
            );
        });

        return (
            <div className="dashboard-dataset-teasers fade-in inner-route admin-jobs clearfix">
                <div className="clearfix">
                    <h2>Job Definitions</h2>
                    <button className="btn-blue" onClick={actions.toggleModal.bind(this, 'defineJob')} >
                        <span>Define a Job</span>
                    </button>
                </div>
                <div className="col-xs-12 job-panel-wrap">
                        <div className="fade-in job-panel-header clearfix" >
                            <div className="col-xs-5 job-col"><label>Job</label></div>
                            <div className="col-xs-3 job-col"><label>Container Image</label></div>
                            <div className="col-xs-2 job-col"><label>Status</label></div>
                            <div className="col-xs-2 job-col"><label>Actions</label></div>
                        </div>
                </div>
                {Object.keys(this.state.datasets.apps).length == 0 ? noJobs : jobs}
                <DefineJobModal
                    show={this.state.modals.defineJob}
                    onHide={actions.toggleModal.bind(this, 'defineJob')}
                    edit={this.state.jobDefinitionForm.edit}/>
            </div>
        );
    }

});

export default Jobs;
