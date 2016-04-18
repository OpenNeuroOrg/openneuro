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
        let apps        = this.state.apps,
            dataset     = this.state.dataset,
            loadingApps = this.state.loadingApps,
            users       = this.state.users,
            modals      = this.state.modals,
            snapshots   = this.state.snapshots;

        return (
            <div>
                <Share dataset={dataset} users={users} show={modals.share} onHide={datasetActions.toggleModal.bind(null, 'share')}/>
                <Jobs
                    dataset={dataset}
                    apps={apps}
                    loadingApps={loadingApps}
                    snapshots={snapshots}
                    show={modals.jobs}
                    onHide={datasetActions.dismissJobsModal} />
                <Publish
                    dataset={dataset}
                    snapshots={snapshots}
                    show={modals.publish}
                    onHide={datasetActions.toggleModal.bind(null, 'publish')} />
            </div>
        );
    }

});

export default ToolModals;