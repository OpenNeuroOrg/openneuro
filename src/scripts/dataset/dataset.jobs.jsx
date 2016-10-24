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

// life cycle events --------------------------------------------------

    render () {
        if (!this.state.dataset.original) {
            return false;
        }

        let jobs = this.state.jobs.map((job) => {
            return (
                <Panel className="jobs" header={job.appLabel + ' - v' + job.appVersion}  key={job.appId} eventKey={job.appId}>
                        {this._runs(job)}
                </Panel>
            );
        });

        let header = <h3 className="metaheader">Analyses</h3>;
        return (
            <div className="analyses">
                {jobs.length === 0 ?  null : header }
                <Accordion accordion className="jobs-wrap" activeKey={this.state.activeJob} onSelect={actions.selectJob}>
                    {this.state.loadingJobs ? <Spinner active={true} text="Loading Analyses" /> : jobs}
                </Accordion>
            </div>
        );
    },

// templates methods --------------------------------------------------

    _runs(job) {
        let runs = job.runs.map((run) => {
            return <Run run={run} key={run._id} />;
        });

        return runs;
    }

});

export default Jobs;