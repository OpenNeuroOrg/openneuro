// dependencies -------------------------------------------------------

import React      from 'react';
import Reflux     from 'reflux';
import Input      from '../common/forms/input.jsx';
import adminStore from './admin.store';
import actions    from './admin.actions';

let Logs = React.createClass({

    mixins: [Reflux.connect(adminStore)],

// life cycle events --------------------------------------------------

    render() {
        let logz = [];

        this.state.eventLogs.map((log, index) => {
            if(log.visible){
                logz.push(
                    <div className="fade-in user-panel-header clearfix" key={index}>
                        <div className="col-xs-4 user-col"><label>{log.type}</label></div>
                        <div className="col-xs-4 user-col"><label>{log.user}</label></div>
                        <div className="col-xs-4 user-col"><label>{log.date}</label></div>
                    </div>
                );
            }
        });
        return (
            <div className="dashboard-dataset-teasers fade-in admin-users clearfix">
                <div className="header-wrap clearfix">
                    <div className="col-sm-9">
                        <h2>Events Log</h2>
                    </div>
                    <div className="col-sm-3">
                        <Input className="pull-right" placeholder="Search Type or Email" onChange={this._searchLogs} />
                    </div>
                </div>

                <div>
                    <div className="col-xs-12 users-panel-wrap">
                        <div className="fade-in user-panel-header clearfix" >
                            <div className="col-xs-4 user-col"><label>Event Type</label></div>
                            <div className="col-xs-4 user-col"><label>User</label></div>
                            <div className="col-xs-4 user-col"><label>Date</label></div>
                        </div>
                        {logz.length != 0 ? logz : null}
                    </div>
                </div>
            </div>
        );
    },

    _searchLogs(e) {
        actions.searchLogs(e.target.value);
    }
});

export default Logs;
