// dependencies -------------------------------------------------------

import React from 'react'
import { Link, useHistory } from 'react-router-dom'
import SearchInput from '../search/search-input.tsx'
import FrontPageStats from './front-page-stats.jsx'
import FrontPageTabs from './front-page-tabs.jsx'
import Footer from '../common/partials/footer.jsx'
import AdditionalInfo from './front-page-additional-info.jsx'
import LoggedOut from '../authentication/logged-out.jsx'
import AuthenticationButtons from '../authentication/buttons.jsx'
import SubscribeToNewsletter from '../datalad/mutations/subscribe-to-newsletter.jsx'
import FrontPageTopDatasets from './front-page-top-datasets.jsx'
import Helmet from 'react-helmet'
//configurables
import { frontPage } from 'openneuro-content'

const LogoText = () => (
  <div className="logo-text">
    Open
    <span className="logo-end">Neuro</span>
  </div>
)

const LogoLayers = () => {
  if (
    frontPage.titlePanel &&
    frontPage.titlePanel.logos &&
    frontPage.titlePanel.logos.length
  ) {
    if (frontPage.titlePanel.logos.length > 1) {
      const logoLayers = frontPage.titlePanel.logos.map((item, index) => {
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
      const logo = frontPage.titlePanel.logos[0]
      return <img className={logo.class} src={logo.src} alt={logo.alt} />
    }
  } else {
    return null
  }
}

const handleSearch = history => searchQuery => {
  history.push(`/search/${searchQuery}`)
}

const FrontPage = () => {
  const history = useHistory()
  return (
    <span className="front-page is-front">
      <Helmet>
        <title>
          {frontPage.pageDescription} - {frontPage.pageTitle}
        </title>
      </Helmet>
      <div className="intro">
        <div className="container">
          <div className="intro-inner fade-in clearfix">
            <div className="clearfix welcome-block">
              <LogoLayers />
              {frontPage.titlePanel.logoText ? <LogoText /> : null}
              <h1>{frontPage.pageDescription}</h1>
              <LoggedOut>
                <div className="sign-in-block fade-in">
                  <AuthenticationButtons />
                </div>
              </LoggedOut>
              <SearchInput
                className="frontpage-search"
                onSearch={handleSearch(history)}
              />
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

export default FrontPage
