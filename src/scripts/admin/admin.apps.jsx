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

let Apps = React.createClass({

    mixins: [Reflux.connect(adminStore), Reflux.connect(datasetStore, 'datasets')],

// life cycle events --------------------------------------------------

    render() {
        let noJobs = <div className="no-results">There are no apps defined.</div>;
        let jobs = batch.filterAppDefinitions(this.state.datasets.apps).map((app, index) => {
            //Need to explain this. And should probably stop calling everything app.
            let appName = Object.keys(app)[0];
            let list = this._versionList(app[appName]);
            return (
                <Panel header={appName} eventKey={index} key={index} className="col-xs-12 job-panel-wrap">
                    <div className="job-panel-header clearfix col-xs-12" >
                        <div className="row">
                            <div className="col-xs-3 job-col"><label>{app[appName][0].jobDefinitionName} Version</label></div>
                            <div className="col-xs-3 job-col"><label>Container Image</label></div>
                            <div className="col-xs-3 job-col"><label>Status</label></div>
                            <div className="col-xs-3 job-col last"><label>Actions</label></div>
                        </div>
                    </div>
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
                <Accordion className="clearfix">
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
        let list = apps.reverse().map((app, index) => {
            let bidsContainer = batch.getBidsContainer(app);

            let activeStatus    = <span className="label label-success "><i className="fa fa-check-circle" aria-hidden="true"></i> {app.status}</span>;
            let inactiveStatus  = <span className="label label-warning"><i className="fa fa-exclamation-triangle"></i> {app.status}</span>;

            return (
                <div className="job-panel col-xs-12" key={index}>
                    <div className="row">
                        <div className="col-xs-3 job-col">
                            <div className="job-name">
                                <span>{'v' + ":" + app.revision}</span>
                            </div>
                        </div>
                        <div className="col-xs-3 job-col">
                            <div>{bidsContainer}</div>
                        </div>
                        <div className="col-xs-3 job-col">
                            <div className={app.status}>{app.status === 'ACTIVE' ? activeStatus : inactiveStatus}</div>
                        </div>
                        <div className="col-xs-3  job-col last">
                            <div className="tools clearfix">
                                <button className="tool cte-edit-button btn btn-admin fade-in" onClick={actions.editJobDefinition.bind(this, app)} ><i className="fa fa-pencil" ></i> Edit </button>
                                <button className="tool cte-edit-button btn btn-admin fade-in" onClick={actions.disableJobDefinition.bind(this, app)} ><i className="fa fa-ban" ></i> Disable</button>
                            </div>
                        </div>
                    </div>
                </div>
            )
        });

        return list;
    }

});

export default Apps;
