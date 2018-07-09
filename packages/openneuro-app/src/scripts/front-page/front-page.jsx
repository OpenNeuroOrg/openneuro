// dependencies -------------------------------------------------------

import React from 'react'
import { Link } from 'react-router-dom'
import FrontPageTabs from './front-page-tabs.jsx'
import Footer from '../common/partials/footer.jsx'
import Pipelines from './front-page.pipelines.jsx'
import AdditionalInfo from './front-page-additional-info.jsx'
import LoggedOut from '../authentication/logged-out.jsx'
import AuthenticationButtons from '../authentication/buttons.jsx'

// assets -------------------------------------------------------------

// configurables
import configurables from './front-page-config'

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
                {configurables.titlePanel.logoText ? this._logoText() : null}
                <h1>{configurables.pageDescription}</h1>
                <LoggedOut>
                  <div className="sign-in-block fade-in">
                    <AuthenticationButtons />
                  </div>
                </LoggedOut>
                <div className="browse-publicly">
                  <Link to="/public/datasets">
                    <span>Browse Public Datasets</span>
                  </Link>
                </div>
                <div className="privacy-detail">
                  <span>{configurables.titlePanel.privacyDetail}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {configurables.frontPageExtras ? <FrontPageTabs /> : null}
        <Pipelines />
        <AdditionalInfo />
        <Footer />
      </span>
    )
  }

  // custom methods -------------------------------------------------------

  _error(signinError, loadingState) {
    if (signinError && !loadingState) {
      const errMessage = this.state.users.signinError
      // This special case is fairly common and needs to return a richer error
      if (
        errMessage ===
        'Your ORCID account does not have an e-mail, or your e-mail is not public. Please fix your account before continuing.'
      ) {
        return (
          <div className="alert alert-danger">
            <span>
              Your ORCID account does not have an e-mail, or your e-mail is not
              public. Visit your{' '}
              <a href="https://orcid.org/my-orcid">ORCID profile</a> and verify
              your primary email privacy is set to public.
            </span>
          </div>
        )
      } else {
        return <div className="alert alert-danger">{errMessage}</div>
      }
    }
  }

  // template functions ----------------------------------------------------

  _logoLayers() {
    let logoLayers = configurables.titlePanel.logos.map((item, index) => {
      return (
        <img key={index} className={item.class} src={item.src} alt={item.alt} />
      )
    })

    return <div className="logo-layers">{logoLayers}</div>
  }

  _logoText() {
    return (
      <div className="logo-text">
        Open<span className="logo-end">Neuro</span>
      </div>
    )
  }
}

export default FrontPage
