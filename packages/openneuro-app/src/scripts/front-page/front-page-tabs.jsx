// dependencies -------------------------------------------------------

import React from 'react'

import tab_get_data from './assets/tab-get_data.png'
import get_data_browse from './assets/get_data_browse.png'
import get_data_download from './assets/get_data_download.png'
import tab_share_data from './assets/tab-share_data.png'
import share_data_collaborate from './assets/share_data_collaborate.png'
import share_data_publish from './assets/share_data_publish.png'
import tab_use_data from './assets/tab-use_data.png'
import use_data_analyze from './assets/use_data_analyze.png'
import use_data_snapshot from './assets/use_data_snapshot.png'

class FrontPageTabs extends React.Component {
  constructor() {
    super()
    this.state = {
      currentTab: null,
    }
  }

  // life cycle events --------------------------------------------------
  render() {
    return (
      <div id="data-tabs">
        <ul className="nav nav-tabs">{this._tabs()}</ul>
        {this._tabContent(this.state.currentTab)}
      </div>
    )
  }

  // template functions -------------------------------------------------------

  _tabs() {
    return this._tabData().map((tab, index) => {
      return (
        <li key={index}>
          <div
            className={
              this.state.currentTab == index ? 'active thumbnail' : 'thumbnail'
            }
            onClick={this._showTabContent.bind(this, index)}>
            <img src={tab.icon} alt={tab.header} />
            <div className="caption">
              <h3>{tab.header}</h3>
              <p>{tab.abstract}</p>
            </div>
            <div className="more">
              <span className="text">
                {this.state.currentTab == index ? 'less' : 'more'}
              </span>
            </div>
          </div>
        </li>
      )
    })
  }

  // custom methods -------------------------------------------------------

  _tabContent(currentTab) {
    if (currentTab == null) {
      return false
    } else {
      let tab = this._tabData()[currentTab]
      return (
        <div className="tab-content">
          <div className="row">
            <div className="col-md-6">
              <div className="row">
                <div className="img-wrap">
                  <img className={tab.firstImageClass} src={tab.firstImage} />
                </div>
                <div className="caption">
                  <h3>{tab.firstHeader}</h3>
                  <p>{tab.firstDescription}</p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="row">
                <div className="img-wrap">
                  <img className={tab.secondImageClass} src={tab.secondImage} />
                </div>
                <div className="caption">
                  <h3>{tab.secondHeader}</h3>
                  <p>{tab.secondDescription}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  }

  _showTabContent(tab) {
    if (tab == this.state.currentTab) {
      this.setState({ currentTab: null })
    } else {
      this.setState({ currentTab: tab })
    }
  }

  // data -----------------------------------------------------------------

  _tabData() {
    return [
      {
        header: 'Get Data',
        abstract:
          'Browse and download datasets from contributors all over the world.',
        icon: tab_get_data,
        firstHeader: 'Browse Data',
        firstDescription: (
          <span>
            Browse and explore public datasets and analyses from a wide range of
            global contributors. Our collection of{' '}
            <strong>{this.state.datasetCount}</strong> public datasets continues
            to grow as more and more become{' '}
            <a href="http://bids.neuroimaging.io/">BIDS</a> compatible.
          </span>
        ),
        firstImage: get_data_browse,
        firstImageClass: 'browse',
        secondHeader: 'Download Data',
        secondDescription:
          'Download and use public data to create new datasets and run your own analyses.',
        secondImage: get_data_download,
        secondImageClass: 'download',
      },
      {
        header: 'Share Data',
        abstract:
          'Upload your data and collaborate with your colleagues or share it with users around the world.',
        icon: tab_share_data,
        firstHeader: 'Collaborate',
        firstDescription:
          'Privately share your data so your colleagues can view and edit your work.',
        firstImage: share_data_collaborate,
        firstImageClass: 'collabotate',
        secondHeader: 'Publish',
        secondDescription:
          'Publish your dataset in an NIH Brain Initiative approved repository where anyone can view, download, and run analyses on it.',
        secondImage: share_data_publish,
        secondImageClass: 'publish',
      },
      {
        header: 'Use Data',
        abstract: 'Use our affiliated website to process applicable data.',
        icon: tab_use_data,
        firstHeader: 'Snapshot',
        firstDescription:
          'Create snapshots of your datasets to ensure past analyses remain reproducible as your datasets grow and change. Publish any of your snapshots while you continue work on your original data behind the scenes.',
        firstImage: use_data_snapshot,
        firstImageClass: 'snapshot',
        secondHeader: 'Analyze',
        secondDescription:
          "Explore your published OpenNeuro dataset using BrainLife's computing network. Utilize their community driven apps to run a variety of analysis and processing software in the browser.",
        secondImage: use_data_analyze,
        secondImageClass: 'analyze',
      },
    ]
  }
}

export default FrontPageTabs
