// dependencies -------------------------------------------------------

import React from 'react'
import { Link } from 'react-router-dom'
import Footer from '../common/partials/footer.jsx'
//configurables
import { frontPage } from 'openneuro-content'

// component setup ----------------------------------------------------

class PETDummy extends React.Component {
  constructor(props) {
    super(props)
  }

  // life cycle events --------------------------------------------------

  render() {
    return (
      <span className="front-page is-front">
        <div className="intro pet-block">
          <div className="container">
            <div className="intro-inner fade-in clearfix">
              <div className="clearfix welcome-block">
                <h1 className="pet-header">Coming soon!</h1>
                <h2>
                  A section of OpenNeuro dedicated entirely to PET scans is
                  currently under development.{' '}
                </h2>
                <h3>
                  In the meantime, feel free to explore{' '}
                  <Link to="/">OpenNeuro</Link> or visit existing hosted PET
                  datasets{' '}
                  <Link to="/datasets/ds001421">
                    [11C]SB207145 PET Cimbi database example
                  </Link>
                  ,{' '}
                  <Link to="/datasets/ds001420">
                    [11C]DASB PET Cimbi database example
                  </Link>
                  , or{' '}
                  <Link to="/datasets/ds000204">
                    Imaging [18F]AV-1451 and [18F]AV-45 in acute and chronic
                    traumatic brain injury
                  </Link>
                  .
                </h3>
                <div className="privacy-detail">
                  <span>{frontPage.titlePanel.privacyDetail}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </span>
    )
  }
}

export default PETDummy
