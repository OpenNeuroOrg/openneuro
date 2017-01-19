// dependencies -------------------------------------------------------

import React                       from 'react';
import {State, RouteHandler, Link} from 'react-router';

let Dashboard = React.createClass({

    mixins: [State],

    getInitialState () {
        return {isPublic: this._isPublic()};
    },

// life cycle events --------------------------------------------------

    componentWillReceiveProps() {
        this.setState({isPublic: this._isPublic()});
    },

    render () {
        let isPublic = this.state.isPublic;
        return (
            <div className="fade-in inner-route clearfix">
                <div className="col-xs-12">
                    <ul className="nav nav-pills tabs">
                        <li><Link to={isPublic ? 'publicDatasets' : 'datasets'} className="btn-tab">{isPublic ? 'Public' : 'My'} Datasets</Link></li>
                        <li><Link to={isPublic ? 'publicJobs'     : 'jobs'}     className="btn-tab">{isPublic ? 'Public' : 'My'} Analyses</Link></li>
                    </ul>
                    <RouteHandler/>
                </div>
            </div>
        );
    },

// custom methods -----------------------------------------------------

    _isPublic() {
        return this.getPath().indexOf('dashboard') === -1;
    }

});

export default Dashboard;





