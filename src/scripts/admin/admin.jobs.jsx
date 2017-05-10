// dependencies -------------------------------------------------------

import React      from 'react';
import Reflux     from 'reflux';
import {Accordion, Panel} from 'react-bootstrap';
import adminStore from './admin.store';
import actions    from './admin.actions';
import datasetStore from '../dataset/dataset.store';
import WarnButton from '../common/forms/warn-button.jsx';
import DefineJobModal       from './admin.create-job.modal.jsx';
import batch from '../utils/batch.js';

let Jobs = React.createClass({

    mixins: [Reflux.connect(adminStore), Reflux.connect(datasetStore, 'datasets')],

// life cycle events --------------------------------------------------

    render() {
        let noJobs = <div className="no-results">There are no apps defined.</div>;
        let jobs = batch.filterJobDefinitions(this.state.datasets.apps).map((app, index) => {
            //Need to explain this. And should probably stop calling everything app.
            let appName = Object.keys(app)[0];
            let list = this._versionList(app[appName]);
            return (
                <Panel header={appName} eventKey={index} key={index}>
                    {list}
                </Panel>
            );
        });

        return (
            <div className="dashboard-dataset-teasers fade-in inner-route admin-jobs clearfix">
                <div className="clearfix">
                    <h2>App Definitions</h2>
                    <button className="btn-blue" onClick={actions.toggleModal.bind(this, 'defineJob')} >
                        <span>Define an App</span>
                    </button>
                </div>
                <div className="col-xs-12 job-panel-wrap">
                        <div className="fade-in job-panel-header clearfix" >
                            <div className="col-xs-5 job-col"><label>App</label></div>
                            <div className="col-xs-3 job-col"><label>Container Image</label></div>
                            <div className="col-xs-2 job-col"><label>Status</label></div>
                            <div className="col-xs-2 job-col"><label>Actions</label></div>
                        </div>
                </div>
                <Accordion>
                {Object.keys(this.state.datasets.apps).length == 0 ? noJobs : jobs}
                </Accordion>
                <DefineJobModal
                    show={this.state.modals.defineJob}
                    onHide={actions.toggleModal.bind(this, 'defineJob')}
                    edit={this.state.jobDefinitionForm.edit}/>
            </div>
        );
    },

    _versionList(apps) {
        let list = apps.map((app, index) => {
            let bidsContainer = batch.getBidsContainer(app);

            return (
                <div className="job-panel clearfix" key={index}>
                    <div className="col-xs-5 job-col">
                        <h3>
                            <div className="job-name">
                                <span>{app.jobDefinitionName + ":" + app.revision}</span>
                            </div>
                        </h3>
                    </div>
                    <div className="col-xs-3 job-col">
                        <div>{bidsContainer}</div>
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
            )
        });

        return list;
    }

});

export default Jobs;
