// dependencies ------------------------------------------------------------------

import React            from 'react';
import Reflux           from 'reflux';
import {Link}           from 'react-router';
import Usermenu         from './navbar.usermenu.jsx';
import UploadBtn        from './navbar.upload-button.jsx';
import userStore        from '../user/user.store.js';
import userActions      from '../user/user.actions.js';
import Alert            from '../notification/notification.alert.jsx';
import {CollapsibleNav,Nav}          from 'react-bootstrap';

// component setup ---------------------------------------------------------------

let BSNavbar = React.createClass({

    mixins: [Reflux.connect(userStore)],

// life cycle methods ------------------------------------------------------------
    propTypes: {
        routes: React.PropTypes.array
    },

    render: function () {

        let isLoggedIn    = !!this.state.token;
        let googleProfile = this.state.google;
        let loading       = this.state.loading;
        let routes        = this.props.routes;

        return (
            <nav role="navigation" className="navbar navbar-default" toggleNavKey={0}>
                <div className="container">
                    <div className="navbar-header">
                        {this._brand()}
                    </div>
                    <CollapsibleNav className="clearfix" eventKey={0}>
                            {isLoggedIn && !loading ? this._userMenu(googleProfile) : this._signIn(loading, routes)}
                    </CollapsibleNav>
                </div>
                <Alert/>
            </nav>
        );
    },

// template methods --------------------------------------------------------------

    _brand() {
        return (
            <Link to="dashboard" className="navbar-brand">
                <img src="./assets/CRN-Logo-Placeholder.png"
                     alt="Center for Reproducible Neuroscience Logo"
                     title="Center for Reproducible Neuroscience Link To Home Page"/>
            </Link>
        );
    },

    _signIn (loading, routes) {
        let isSignInScreen = false;
        for (let route of routes) {
            if (route.name == 'signIn') {isSignInScreen = true;}
        }

        if (loading) {
            return (
                <div className="navbar-right sign-in-nav-btn">
                    <button className="btn-blue" >
                        <i className="fa fa-spin fa-circle-o-notch" />
                        <span> Signing In</span>
                    </button>
                </div>
            );
        } else {
            return (
                <div className="navbar-right sign-in-nav-btn">
                    <button className="btn-blue" onClick={userActions.signIn.bind(null, {transition: isSignInScreen})} >
                        <i className="fa fa-google" />
                        <span> Sign in</span>
                    </button>
                </div>
            );
        }
    },

    _userMenu(googleProfile) {
        if (googleProfile) {
            return (
                <Nav navbar right className="useradmin-nav clearfix">
                    <div className="clearfix">
                        <UploadBtn />
                        <Usermenu />
                    </div>
                </Nav>
            );
        }
    }

});


export default BSNavbar;
