// dependencies --------------------------------------------------------------

import React                    from 'react';
import Reflux                   from 'reflux';
import Navbar                   from './nav/navbar.jsx';
import bowser                   from 'bowser';
import Happybrowser             from './common/partials/happybrowser.jsx';
import {RouteHandler, State}    from 'react-router';
import Alert                    from './notification/notification.alert.jsx';
import notificationStore        from './notification/notification.store';

import 'babel-polyfill';

// component setup -----------------------------------------------------------

let App = React.createClass({

    mixins: [State, Reflux.connect(notificationStore)],

// life cycle methods --------------------------------------------------------

    render () {
        let alertState = this.state.showAlert;
        let pageClasses = ' ';
        let pagePaths = ' ';
        let routes = this.getRoutes();

        for (let route of routes) {
            pageClasses += route.name + ' ';
            pagePaths = route.path;
        }

        if (pagePaths == '/' || pagePaths == '/sign-in') { pageClasses += 'is-front' + ' ';};

        return (
            <span>
                <div className={'page' + pageClasses}>
                    {!bowser.chrome ?  <Happybrowser /> : null }
                    <span className={'nav-alert-state-' + alertState}>
                        <Alert />
                    </span>
                    <div className={'full-col alert-state-' + alertState}>
                        <Navbar routes={routes} />
                        <div className="main view container">
                            <div className="route-wrapper">
                                <RouteHandler/>
                            </div>
                        </div>
                    </div>
                </div>
            </span>
        );
    }

});

export default App;