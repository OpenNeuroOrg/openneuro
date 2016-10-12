// dependencies -------------------------------------------------------

import React     from 'react';
import Reflux    from 'reflux';
import userStore from './user.store.js';
import {Link}    from 'react-router';
import Spinner   from '../common/partials/spinner.jsx';
import {Tabs, Tab} from 'react-bootstrap';

// component setup ----------------------------------------------------

let FrontPage = React.createClass({

    mixins: [Reflux.connect(userStore)],

// life cycle events --------------------------------------------------
    getInitialState () {
        return {
            currentTab: 0
        };
    },

    render () {
        let form;
        if (!this.state.loading) {
            form = (
                <span>
                    <button className="btn-admin" onClick={userStore.signIn} >
                        <i className="fa fa-google" /> Sign in with Google
                    </button>
                </span>
            );
        }

        let error;
        if (this.state.signinError && !this.state.loading) {
            error = <div className="alert alert-danger">{this.state.signinError}</div>;
        }

        let welcomeHeader = (
                <div className="intro">
                    <div className="container">
                        <div className="intro-inner fade-in clearfix">
                            <div className="clearfix welcome-block">
                                <div className="logo-layers">
                                    <img className="logo-layer-users" src="./assets/logo_users.png" alt="OpenNeuro Logo" />
                                    <img className="logo-layer-cube" src="./assets/logo_cube.png" alt="OpenNeuro Logo" />
                                    <img className="logo-layer-app" src="./assets/logo_app.png" alt="OpenNeuro Logo" />
                                    <img className="logo-layer-data" src="./assets/logo_data.png" alt="OpenNeuro Logo" />
                                </div>
                                <div className="logo-text">Open<span className="logo-end">Neuro</span></div>
                                <h1>A free and open platform that enables the analysis and sharing of neuroimaging data</h1>
                                <div className="sign-in-block fade-in">
                                    {error}
                                    {form}
                                    <Spinner text="Signing in..." active={this.state.loading} />
                                </div>
                                <div className="browse-publicly">
                                    <Link to="public"><span>Browse Public Datasets</span></Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        );

        let tabTitle_one = (
            <div className="thumbnail" onClick={this._showTabContent.bind(this, 1)}>
                <img src="./assets/tab-get_data.png" alt="Get Data" />
                <div className="caption">
                    <h3>Get Data</h3>
                    <p>Find, download, and use data. Consectetur adipiscing elit.</p>
                </div>
                <div className="more">More</div>
            </div>
        );
        let tabTitle_two = (
            <div className="thumbnail" onClick={this._showTabContent.bind(this, 2)}>
                <img src="./assets/tab-share_data.png" alt="Get Data" />
                <div className="caption">
                    <h3>Share Data</h3>
                    <p>Find, download, and use data. Consectetur adipiscing elit.</p>
                </div>
                <div className="more">More</div>
            </div>
        );
        let tabTitle_three = (
            <div className="thumbnail" onClick={this._showTabContent.bind(this, 3)}>
                <img src="./assets/tab-use_data.png" alt="Get Data" />
                <div className="caption">
                    <h3>Use Data</h3>
                    <p>Find, download, and use data. Consectetur adipiscing elit.</p>
                </div>
                <div className="more">More</div>
            </div>
        );

        let firstHeader, firstDescription, firstImage, secondHeader, secondDescription, secondImage;

        switch(this.state.currentTab) {
            case 1:
                firstHeader         = 'Validation';
                firstDescription    = (
                    <span>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque sodales ac eros sit amet euismod. Vestibulum in sem quis velit volutpat sodales in quis elit.</p>
                        <p>Quisque sodales ac eros sit amet emod. Vestibulum in sem quis velit volutpat sodales in quis elit.</p>
                    </span>
                );
                firstImage          = <img src="./assets/tab-content_image.png" alt="Get Data" />;
                secondHeader        = 'This is the second header';
                secondDescription   = (
                    <span>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque sodales ac eros sit amet euismod. Vestibulum in sem quis velit volutpat sodales in quis elit.</p>
                        <p>Quisque sodales ac eros sit amet emod. Vestibulum in sem quis velit volutpat sodales in quis elit.</p>
                    </span>
                );
                secondImage         = <img src="./assets/tab-content_image.png" alt="Get Data" />;
                break;
            case 1:
                firstHeader         = 'one';
                firstDescription    = 'asdf';
                firstImage          = <img src="./assets/tab-content_image.png" alt="Get Data" />;
                secondHeader        = 'asdfasdf';
                secondDescription   = 'asdjfh';
                secondImage         = <img src="./assets/tab-content_image.png" alt="Get Data" />;
                break;
            case 2:
                firstHeader         = 'two';
                firstDescription    = 'asdf';
                firstImage          = <img src="./assets/tab-content_image.png" alt="Get Data" />;
                secondHeader        = 'asdfasdf';
                secondDescription   = 'asdjfh';
                secondImage         = <img src="./assets/tab-content_image.png" alt="Get Data" />;
                break;
            case 3:
                firstHeader         = 'three';
                firstDescription    = 'asdf';
                firstImage          = <img src="./assets/tab-content_image.png" alt="Get Data" />;
                secondHeader        = 'asdfasdf';
                secondDescription   = 'asdjfh';
                secondImage         = <img src="./assets/tab-content_image.png" alt="Get Data" />;
        }

        let tabcontent = (
            <div className="data-tab-content">
                <div className="row">
                    <div className="col-md-6">
                        <div className="row">
                            <div className="img-wrap">{firstImage}</div>
                            <div className="caption">
                                <h3>{firstHeader}</h3>
                                <p>{firstDescription}</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="row">
                            <div className="img-wrap">{secondImage}</div>
                            <div className="caption">
                                <h3>{secondHeader}</h3>
                                {secondDescription}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );

        let tabSections = (
            <div id="data-tabs">
                <ul className="nav nav-tabs">
                    <li>{tabTitle_one}</li>
                    <li>{tabTitle_two}</li>
                    <li>{tabTitle_three}</li>
                </ul>
                <div className="tab-content">{this.state.currentTab != 0 ? tabcontent : null}</div>
            </div>
        );

        return (
            <span>
                {welcomeHeader}
                {tabSections}
            </span>
        );
    },


    _showTabContent(tab){
        if(tab == this.state.currentTab){
            this.setState({currentTab: 0});
        }else{
             this.setState({currentTab: tab});
        }
    }

});

export default FrontPage;