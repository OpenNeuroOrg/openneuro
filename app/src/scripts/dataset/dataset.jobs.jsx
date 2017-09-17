// dependencies -------------------------------------------------------

import React        from 'react';
import Reflux       from 'reflux';
import datasetStore from './dataset.store';
import actions      from './dataset.actions';
import Spinner      from '../common/partials/spinner.jsx';
import Run          from './dataset.jobs.run.jsx';
import { Accordion, Panel } from 'react-bootstrap';

let Jobs = React.createClass({

    mixins: [Reflux.connect(datasetStore)],

    getInitialState () {
        let initialState = {
            acknowledgements:   "",
            support:            "",
            summary:            "",
            label:              "",
        };

        return initialState;
    },

    componentWillMount() {
        this._arrayObject();
    },

    componentDidUpdate(prevProps, prevState) {
        // There is a bug with activeJob, when state changes twice causing an infinite loop, this is a store debug needed from prior code. Must compare to label in orer to update state without causing an infinite loop.
        if(this.state.label === this.state.activeJob.app) {
        } else {
            this._arrayObject();
        };
  },

// life cycle events --------------------------------------------------

    render () {
        let version;

        if (!this.state.dataset.original) {
            return false;
        }

        let app = this.state.jobs.map((app) => {

            version = app.versions.map((version) => {
                let appDef = this.state.apps[app.label][version.label];
                let bidsAppVersion = appDef.containerProperties.environment.filter((tuple) => {
                    return tuple.name === 'BIDS_CONTAINER';
                })[0].value;
                let compositeVersion = bidsAppVersion + ' - #' + version.label;
                return (
                    <Panel className="jobs" header={compositeVersion}  key={version.label} eventKey={version.label}>
                        {this._runs(version)}
                    </Panel>
                );
            });

            return (
                <Panel className="jobs" header={app.label}  key={app.label} eventKey={app.label}>
                        {this._return()}
                    <Accordion accordion className="jobs-wrap" activeKey={this.state.activeJob.version} onSelect={actions.selectJob.bind(null, 'version')}>
                        {version}
                    </Accordion>
                </Panel>
            );
        });

        let header = <h3 className="metaheader">Analyses</h3>;

        return (
            <div className="analyses">
                {app.length === 0 ?  null : header }
                <Accordion accordion className="jobs-wrap" activeKey={this.state.activeJob.app} onSelect={actions.selectJob.bind(null, 'app')}>
                    {this.state.loadingJobs ? <Spinner active={true} text="Loading Analyses" /> : app}
                </Accordion>
            </div>
        );
    },

// templates methods --------------------------------------------------

    _runs(job) {
        let runs = job.runs.map((run) => {
            return (
                <Run run={run}
                     key={run._id}
                     toggleFolder={actions.toggleResultFolder}
                     displayFile={actions.displayFile}
                     currentUser={this.state.currentUser}/>
            );
        });

        return runs;
    },

    _arrayObject() {
        let activeJob = this.state.activeJob.app;
        let apps = this.state.apps;

        Object.keys(apps).map((key) => {
            let jobs = apps[key];
            Object.keys(jobs).map((key) => {
                let job = jobs[key];
                if (job.jobDefinitionName === activeJob) {
                    let acknowledgements = job.descriptions.acknowledgements;
                    let support          = job.descriptions.support;
                    let summary          = job.descriptions.shortDescription;

                    this.setState({
                        acknowledgements : acknowledgements,
                        support          : support,
                        summary          : summary,
                        label            : activeJob
                    }, function() {});
                }
            });
        });
        this._return()
    },

    _return() {        
        return (
            <div className="app-descriptions">
                <strong> {this.state.summary}</strong>
                <br />
                <br />
                <label>App created by</label><strong> {this.state.acknowledgements}</strong>
                <br />
                <label>Support at</label><strong id="support"> {this.state.support}</strong>
            </div>
        )
    },

});

export default Jobs;
