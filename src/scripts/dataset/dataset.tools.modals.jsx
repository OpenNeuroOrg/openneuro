// dependencies -------------------------------------------------------

import React          from 'react';
import Reflux         from 'reflux';
import Share          from './dataset.tools.share.jsx';
import Jobs           from './dataset.tools.jobs.jsx';
import Publish        from './dataset.tools.publish.jsx';
import datasetStore   from './dataset.store';
import datasetActions from './dataset.actions.js';

let ToolModals = React.createClass({

    mixins: [Reflux.connect(datasetStore)],

// life cycle events --------------------------------------------------

    componentDidMount() {

    },

    render() {
        let dataset   = this.state.dataset,
            users     = this.state.users,
            snapshots = this.state.snapshots;

        return (
            <div>
                <Share dataset={dataset} users={users} show={this.state.showShareModal} onHide={datasetActions.toggleModal.bind(null, 'Share')}/>
                <Jobs
                    dataset={dataset}
                    apps={this.state.apps}
                    loadingApps={this.state.loadingApps}
                    snapshots={snapshots}
                    show={this.state.showJobsModal}
                    onHide={datasetActions.dismissJobsModal} />
                <Publish
                    dataset={dataset}
                    snapshots={snapshots}
                    show={this.state.showPublishModal}
                    onHide={datasetActions.toggleModal.bind(null, 'Publish')} />
            </div>
        );
    }

});

export default ToolModals;