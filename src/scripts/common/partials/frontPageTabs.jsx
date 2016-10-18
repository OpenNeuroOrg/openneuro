// dependencies -------------------------------------------------------

import React       from 'react';
import Reflux      from 'reflux';
import {Link}      from 'react-router';
import uploadStore from '../../upload/upload.store.js';
import Actions     from '../../user/user.actions.js';
import userStore   from '../../user/user.store.js';
import packageJson from '../../../../package.json';


let FrontPageTabs = React.createClass({

    mixins: [Reflux.connect(userStore)],

// life cycle events --------------------------------------------------

    getInitialState () {
        return {
            currentTab: 0
        };
    },

    render () {
        let tabs = (
            <ul className="nav nav-tabs">
                <li>
                    <div className={this.state.currentTab == 1 ? 'active thumbnail' : 'thumbnail'} onClick={this._showTabContent.bind(this, 1)}>
                        <img src="./assets/tab-get_data.png" alt="Get Data" />
                        <div className="caption">
                            <h3>Get Data</h3>
                            <p>Find, download, and use data. Consectetur adipiscing elit.</p>
                        </div>
                        <div className="more"><span className="text">{this.state.currentTab == 1 ? 'less': 'more'}</span></div>
                    </div>
                </li>
                <li>
                    <div className={this.state.currentTab == 2 ? 'active thumbnail' : 'thumbnail'} onClick={this._showTabContent.bind(this, 2)}>
                        <img src="./assets/tab-share_data.png" alt="Get Data" />
                        <div className="caption">
                            <h3>Share Data</h3>
                            <p>Find, download, and use data. Consectetur adipiscing elit.</p>
                        </div>
                        <div className="more"><span className="text">{this.state.currentTab == 2 ? 'less': 'more'}</span></div>
                    </div>
                </li>
                <li>
                    <div className={this.state.currentTab == 3 ? 'active thumbnail' : 'thumbnail'} onClick={this._showTabContent.bind(this, 3)}>
                        <img src="./assets/tab-use_data.png" alt="Get Data" />
                        <div className="caption">
                            <h3>Use Data</h3>
                            <p>Find, download, and use data. Consectetur adipiscing elit.</p>
                        </div>
                        <div className="more"><span className="text">{this.state.currentTab == 3 ? 'less': 'more'}</span></div>
                    </div>
                </li>
            </ul>
        );



        return (
            <div id="data-tabs">
                {tabs}
                {this._tabContent(this.state.currentTab)}
            </div>
        );
    },

// custom methods -------------------------------------------------------

    _tabContent(currentTab){

        let firstHeader, firstDescription, firstImage, secondHeader, secondDescription, secondImage;

        if(currentTab == 0){
            return false;
        }else{
            switch(currentTab) {
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

            return(
                <div className="tab-content">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="row">
                                <div className="img-wrap">{firstImage}</div>
                                <div className="caption">
                                    <h3>{firstHeader}</h3>
                                    {firstDescription}
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
        }
    },

    _showTabContent(tab){
        if(tab == this.state.currentTab){
            this.setState({currentTab: 0});
        }else{
             this.setState({currentTab: tab});
        }
    }
});

export default FrontPageTabs;