// dependencies ------------------------------------------------------------------

import React            from 'react';
import Reflux           from 'reflux';
import {Link}           from 'react-router';
import Usermenu         from './navbar.usermenu.jsx';
import UploadBtn        from './navbar.upload-button.jsx';
import userStore        from '../user/user.store.js';
import userActions      from '../user/user.actions.js';
import Alert            from '../notification/notification.alert.jsx';
import {CollapsibleNav} from 'react-bootstrap';

// component setup ---------------------------------------------------------------

let BSNavbar = React.createClass({

    mixins: [Reflux.connect(userStore)],

// life cycle methods ------------------------------------------------------------
    propTypes: {
        routes: React.PropTypes.array
    },

    render: function () {
        return (
            <nav role="navigation" className="navbar navbar-default" toggleNavKey={0}>
                <div className="container-fluid">
                    <div className="navbar-header">
                        {this._brand()}
                    </div>
                    <div className="clearfix">
                        {this._navMenu()}
                    </div>
                </div>
                <Alert/>
            </nav>
        );
    },

// template methods --------------------------------------------------------------

    _brand(){
        return(
            <Link to="dashboard" className="navbar-brand">
                <img src="./assets/CRN-Logo-Placeholder.png"
                     alt="Center for Reproducible Neuroscience Logo"
                     title="Center for Reproducible Neuroscience Link To Home Page"/>
            </Link>
        );
    },

    _navMenu() {
        let isLoggedIn    = !!this.state.token;
        let googleProfile = this.state.google;
        let loading       = this.state.loading;
        let routes        = this.props.routes;
        let adminLink     = <Link className="nav-link" to="admin"><span className="link-name">admin</span></Link>;
        let dashboardLink = <Link className="nav-link" to="dashboard"><span className="link-name">my datasets</span></Link>;

        return (
            <ul className="nav navbar-nav main-nav">
                <li className="link-dashboard">
                    {userStore.hasToken() ? dashboardLink : null}
                </li>
                <li className="link-admin">
                    {this.state.scitran && this.state.scitran.root ? adminLink : null }
                </li>
                <li className="link-public">
                    <Link className="nav-link" to="public"><span className="link-name">Public Datasets</span></Link>
                </li>
                <li className="link-contact">
                    <a className="nav-link" href="mailto:openfmri@gmail.com?subject=Center%20for%20Reproducible%20Neuroscience%20Contact" target="_blank"><span className="link-name">contact</span></a>
                </li>
                <li className="link-dashboard">
                    <UploadBtn />
                </li>
                 <li>
                     <CollapsibleNav eventKey={0}>
                            {isLoggedIn && !loading ? this._userMenu(googleProfile) : this._signIn(loading, routes)}
                    </CollapsibleNav>
                </li>
            </ul>
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
                <Usermenu />
            );
        }
    }

});


export default BSNavbar;
