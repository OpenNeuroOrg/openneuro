// dependencies -------------------------------------------------------

import React       from 'react';
import Reflux      from 'reflux';
import userStore   from '../user/user.store.js';

let FrontPageTabs = React.createClass({

    mixins: [Reflux.connect(userStore)],

// life cycle events --------------------------------------------------

    getInitialState () {
        return {
            currentTab: null
        };
    },

    render () {
        return (
            <div id="data-tabs">
                <ul className="nav nav-tabs">{this._tabs()}</ul>
                {this._tabContent(this.state.currentTab)}
            </div>
        );
    },

// template functions -------------------------------------------------------

    _tabs () {
        return this._tabData.map((tab, index) => {
            return (
                <li key={index}>
                    <div className={this.state.currentTab == index ? 'active thumbnail' : 'thumbnail'} onClick={this._showTabContent.bind(this, index)}>
                        <img src={tab.icon} alt={tab.header} />
                        <div className="caption">
                            <h3>{tab.header}</h3>
                            <p>{tab.abstract}</p>
                        </div>
                        <div className="more"><span className="text">{this.state.currentTab == index ? 'less': 'more'}</span></div>
                    </div>
                </li>
            );
        });
    },

// custom methods -------------------------------------------------------

    _tabContent (currentTab) {
        if (currentTab == null) {
            return false;
        } else {
            let tab = this._tabData[currentTab];
            return(
                <div className="tab-content">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="row">
                                <div className="img-wrap"><img className={tab.firstImageClass} src={tab.firstImage} /></div>
                                <div className="caption">
                                    <h3>{tab.firstHeader}</h3>
                                    <p>{tab.firstDescription}</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="row">
                                <div className="img-wrap"><img className={tab.secondImageClass} src={tab.secondImage} /></div>
                                <div className="caption">
                                    <h3>{tab.secondHeader}</h3>
                                    <p>{tab.secondDescription}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    },

    _showTabContent (tab) {
        if (tab == this.state.currentTab) {
            this.setState({currentTab: null});
        } else {
            this.setState({currentTab: tab});
        }
    },

// data -----------------------------------------------------------------

    _tabData: [
        {
            header:            'Get Data',
            abstract:          'Browse and download datasets from contributors all over the world.',
            icon:              './assets/tab-get_data.png',
            firstHeader:       'Browse Data',
            firstDescription:  <span>Browse and explore public datasets and analyses from a wide range of global contributors. Our collection continues to grow as more and more datasets become <a href="http://bids.neuroimaging.io/">BIDS</a> compatible.</span>,
            firstImage:        './assets/get_data_browse.png',
            firstImageClass:   'browse',
            secondHeader:      'Download Data',
            secondDescription: 'Download and use public data to create new datasets and run your own analyses.',
            secondImage:       './assets/get_data_download.png',
            secondImageClass:   'download'
        },
        {
            header:            'Share Data',
            abstract:          'Upload your data and collaborate with your colleagues or share it with users around the world.',
            icon:              './assets/tab-share_data.png',
            firstHeader:       'Publish',
            firstDescription:  'Publish your datasets for anyone to view, download and run analyses on.',
            firstImage:        './assets/share_data_validate.png',
            firstImageClass:   'validate',
            secondHeader:      'Collaborate',
            secondDescription: 'Privately share your data so your colleagues can view and edit your work.',
            secondImage:       './assets/share_data_collaborate.png',
            secondImageClass:   'collabotate'
        },
        {
            header:            'Use Data',
            abstract:          'Use our available pipelines to process any data on the site.',
            icon:              './assets/tab-use_data.png',
            firstHeader:       'Snapshot',
            firstDescription:  'Create snapshots of your datasets to ensure past analyses remain reproducible as your datasets grow and change. Publish any of your snapshots while you continue work on your original data behind the scenes.',
            firstImage:        './assets/use_data_snapshot.png',
            firstImageClass:   'snapshot',
            secondHeader:      'Analyze',
            secondDescription: 'Use our simple web interface to run your analysis on a super computer. We\'ll notify you when it\'s complete so you can return to review the results.',
            secondImage:       './assets/use_data_analyze.png',
            secondImageClass:   'analyze'
        }
    ]
});

export default FrontPageTabs;
