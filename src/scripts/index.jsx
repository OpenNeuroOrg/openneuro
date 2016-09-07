// dependencies --------------------------------------------------------------

import React                 from 'react';
import Navbar                from './nav/navbar.jsx';
import bowser                from 'bowser';
import Happybrowser          from './common/partials/happybrowser.jsx';
import {RouteHandler, State} from 'react-router';
import 'babel-polyfill';

// component setup -----------------------------------------------------------

let App = React.createClass({

    mixins: [State],

// life cycle methods --------------------------------------------------------

    render () {

        let pageClasses = ' ';
        let routes = this.getRoutes();

        for (let route of routes) { pageClasses += route.name + ' '; }
        let is_front        = this.isActive('signIn');

        return (
            <div className={is_front ? 'page is-front' + pageClasses : 'page' + pageClasses}>
                {!bowser.chrome && !bowser.chromium ?  <Happybrowser /> : null }
                <div className="full-col">
                    <Navbar routes={routes} />
                    <div className="main view container">
                        <div className="route-wrapper">
                            <RouteHandler/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

});

export default App;