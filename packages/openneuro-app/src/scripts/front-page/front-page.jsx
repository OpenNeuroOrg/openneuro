// dependencies -------------------------------------------------------

import React from 'react'
import Reflux from 'reflux'
import { Link } from 'react-router-dom'
import FrontPageTabs from './front-page-tabs.jsx'
import userStore from '../user/user.store.js'
import Spinner from '../common/partials/spinner.jsx'
import Footer from '../common/partials/footer.jsx'
import Pipelines from './front-page.pipelines.jsx'
import FPActions from './front-page.actions.js'
import AdditionalInfo from './front-page-additional-info.jsx'
import { refluxConnect } from '../utils/reflux'

// assets -------------------------------------------------------------

// configurables
import configurables from './front-page-config'

// component setup ----------------------------------------------------

class FrontPage extends Reflux.Component {
  constructor() {
    super()
    refluxConnect(this, userStore, 'users')
  }

  // life cycle events --------------------------------------------------
  componentWillMount() {
    super.componentWillMount()
    FPActions.reset()
  }

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
                <div className="sign-in-block fade-in">
                  {this._error(
                    this.state.users.signinError,
                    this.state.users.loading,
                  )}
                  {this._signinForm(this.state.users.loading)}
                  <Spinner
                    text="Signing in..."
                    active={this.state.users.loading}
                  />
                </div>
                <div className="browse-publicly">
                  <Link to="/public/datasets">
                    <span>Browse Public Datasets</span>
                  </Link>
                </div>
                <div className="privacy-detail">
                  <span>{configurables.titlePanel.privacyDetail}</span>
                  <span>
                    <a href={configurables.titlePanel.privacyLink}>
                      Click here for more information about{' '}
                      {configurables.pageTitle}&#39;s privacy policy.
                    </a>
                  </span>
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

  _signinForm(loadingState) {
    if (!loadingState) {
      if (!this.state.users.token) {
        return (
          <span>
            <button className="btn-admin" onClick={userStore.googleSignIn}>
              <i className="icon fa fa-google" />
              Sign in with Google
            </button>
            <button className="btn-admin" onClick={userStore.orcidSignIn}>
              <span className="icon">
                <img
                  alt="ORCID"
                  width="20"
                  height="20"
                  src="https://orcid.org/sites/default/files/images/orcid_24x24.png"
                />
              </span>
              Sign in with ORCID
            </button>
          </span>
        )
      }
    }
  }

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
