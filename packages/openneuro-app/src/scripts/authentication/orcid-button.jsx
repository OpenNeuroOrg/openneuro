import React from 'react'
import PropTypes from 'prop-types'
import config from '../../../config'

const OrcidButton = ({ min }) => {
  const btnClass = min ? 'btn-blue' : 'btn-admin'
  const size = min ? '16' : '20'
  const btnText = min ? 'ORCID' : 'Sign in with ORCID'
  return (
    <div className="login-btns">
      <a href={config.crn.url + 'auth/orcid'}>
        <button className={btnClass}>
          <span className="icon">
            <img
              alt="ORCID"
              width={size}
              height={size}
              src="https://orcid.org/sites/default/files/images/orcid_24x24.png"
            />
          </span>
          <span>{btnText}</span>
        </button>
      </a>
    </div>
  )
}

OrcidButton.propTypes = {
  min: PropTypes.bool,
}

OrcidButton.defaultProps = {
  min: false,
}

export default OrcidButton
