// dependencies -------------------------------------------------------

import React from 'react'
import { Link } from 'react-router-dom'
import Search from '../common/partials/search.jsx'
import FrontPageStats from './front-page-stats.jsx'
import FrontPageTabs from './front-page-tabs.jsx'
import Footer from '../common/partials/footer.jsx'
import AdditionalInfo from './front-page-additional-info.jsx'
import LoggedOut from '../authentication/logged-out.jsx'
import AuthenticationButtons from '../authentication/buttons.jsx'
import SubscribeToNewsletter from '../datalad/mutations/subscribe-to-newsletter.jsx'
import FrontPageTopDatasets from './front-page-top-datasets.jsx'
//configurables
import { frontPage } from 'openneuro-content'

// component setup ----------------------------------------------------

class FrontPage extends React.Component {
  constructor(props) {
    super(props)
  }

  // life cycle events --------------------------------------------------

  render() {
    return (
      <span className="front-page is-front">
        <div className="intro">
          <div className="container">
            <div className="intro-inner fade-in clearfix">
              <div className="clearfix welcome-block">
                {this._logoLayers()}
                {frontPage.titlePanel.logoText ? this._logoText() : null}
                <h1>{frontPage.pageDescription}</h1>
                <LoggedOut>
                  <div className="sign-in-block fade-in">
                    <AuthenticationButtons />
                  </div>
                </LoggedOut>
                <Search className="frontpage-search" />
                <div className="browse-publicly">
                  <Link to="/public/datasets">
                    <span>Browse All Public Datasets</span>
                  </Link>
                </div>
                <div className="privacy-detail">
                  <span>{frontPage.titlePanel.privacyDetail}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <FrontPageStats />
        {frontPage.frontPageExtras ? <FrontPageTabs /> : null}
        <SubscribeToNewsletter />
        <FrontPageTopDatasets />
        <AdditionalInfo />
        <Footer />
      </span>
    )
  }

  // template functions ----------------------------------------------------

  _logoLayers() {
    if (
      frontPage.titlePanel &&
      frontPage.titlePanel.logos &&
      frontPage.titlePanel.logos.length
    ) {
      if (frontPage.titlePanel.logos.length > 1) {
        let logoLayers = frontPage.titlePanel.logos.map((item, index) => {
          return (
            <img
              key={index}
              className={item.class}
              src={item.src}
              alt={item.alt}
            />
          )
        })
        return <div className="logo-layers">{logoLayers}</div>
      } else {
        let logo = frontPage.titlePanel.logos[0]
        return <img className={logo.class} src={logo.src} alt={logo.alt} />
      }
    } else {
      return null
    }
  }

  _logoText() {
    return (
      <div className="logo-text">
        Open
        <span className="logo-end">Neuro</span>
      </div>
    )
  }
}

export default FrontPage
