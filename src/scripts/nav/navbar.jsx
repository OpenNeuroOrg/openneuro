// dependencies ------------------------------------------------------------------

import React     from 'react';
import Reflux    from 'reflux';
import {Link}    from 'react-router';
import Usermenu  from './navbar.usermenu.jsx';
import UploadBtn from './navbar.upload-button.jsx';
import userStore from '../user/user.store.js';
import {Navbar}  from 'react-bootstrap';

// component setup ---------------------------------------------------------------

let BSNavbar = React.createClass({

    mixins: [Reflux.connect(userStore)],

// life cycle methods ------------------------------------------------------------
    propTypes: {
        routes: React.PropTypes.array
    },

    render: function () {

        return (
            <span>
                <Navbar collapseOnSelect>
                    <Navbar.Header>
                        <Navbar.Brand>
                            {this._brand()}
                        </Navbar.Brand>
                        <Navbar.Toggle />
                    </Navbar.Header>
                    <Navbar.Collapse>
                        {this._navMenu()}
                    </Navbar.Collapse>
                </Navbar>
            </span>
        );
    },

// template methods --------------------------------------------------------------

    _brand(){
        return(
            <Link to="app" className="navbar-brand">
                <img src="./assets/brand_mark.png"
                     alt="OpenNeuro Logo"
                     title="OpenNeuro Link To Home Page"/>
                     <div className="logo-text">Open<span className="logo-end">Neuro</span></div>
            </Link>
        );
    },

    _navMenu() {
        let isLoggedIn    = !!this.state.token;
        let googleProfile = this.state.google;
        let loading       = this.state.loading;
        let routes        = this.props.routes;
        let adminLink     = <Link className="nav-link" to="admin"><span className="link-name">admin</span></Link>;
        let dashboardLink = <Link className="nav-link" to="dashboard"><span className="link-name">my dashboard</span></Link>;

        return (
            <ul className="nav navbar-nav main-nav">
                <li className="link-dashboard">
                    {userStore.hasToken() ? dashboardLink : null}
                </li>
                <li className="link-public">
                    <Link className="nav-link" to="publicDashboard"><span className="link-name">Public Dashboard</span></Link>
                </li>
                <li className="link-contact">
                    <a className="nav-link" href="mailto:openfmri@gmail.com?subject=Center%20for%20Reproducible%20Neuroscience%20Contact" target="_blank"><span className="link-name">contact</span></a>
                </li>
                <li className="link-faq">
                    <Link className="nav-link" to="faq"><span className="link-name">faq</span></Link>
                </li>
                <li className="link-admin">
                    {this.state.scitran && this.state.scitran.root ? adminLink : null}
                </li>
                <li className="link-dashboard">
                    {googleProfile ? <UploadBtn /> : null}
                </li>
                 <li>
                     <Navbar.Collapse eventKey={0}>
                            {isLoggedIn && !loading ? <Usermenu profile={googleProfile}/> : this._signIn(loading, routes)}
                    </Navbar.Collapse>
                </li>
            </ul>
        );
    },

    _signIn (loading, routes) {
        let onFrontPage = false;
        for (let route of routes) {
            if (route.name == 'front-page') {onFrontPage = true;}
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
                    <button className="btn-blue" onClick={userStore.signIn.bind(null, {transition: onFrontPage})} >
                        <i className="fa fa-google" />
                        <span> Sign in</span>
                    </button>
                </div>
            );
        }
    }

});


export default BSNavbar;
