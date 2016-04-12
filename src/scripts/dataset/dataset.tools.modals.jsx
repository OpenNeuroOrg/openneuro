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

    render() {
        let apps             = this.state.apps,
            dataset          = this.state.dataset,
            loadingApps      = this.state.loadingApps,
            users            = this.state.users,
            showJobsModal    = this.state.showJobsModal,
            showPublishModal = this.state.showPublishModal,
            showShareModal   = this.state.showShareModal,
            snapshots        = this.state.snapshots;

        return (
            <div>
                <Share dataset={dataset} users={users} show={showShareModal} onHide={datasetActions.toggleModal.bind(null, 'Share')}/>
                <Jobs
                    dataset={dataset}
                    apps={apps}
                    loadingApps={loadingApps}
                    snapshots={snapshots}
                    show={showJobsModal}
                    onHide={datasetActions.dismissJobsModal} />
                <Publish
                    dataset={dataset}
                    snapshots={snapshots}
                    show={showPublishModal}
                    onHide={datasetActions.toggleModal.bind(null, 'Publish')} />
            </div>
        );
    }

});

export default ToolModals;