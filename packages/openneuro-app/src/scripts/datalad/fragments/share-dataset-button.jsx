import React from 'react'
import PropTypes from 'prop-types'
import Tooltip from '../../common/partials/tooltip.jsx'

// uses the Web Share API - https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share

const ShareDatasetLink = props => {
  const shareHandler = () => {
    //does the user's device or client support the API ?
    if (navigator.share) {
      navigator.share({ url: props.url }).catch(() => err => window.alert(err))
    } else {
      window.alert('Share is not supported on this browser.')
    }
  }
  return (
    <Tooltip tooltip="Share Dataset">
      <span>
        <button className="btn-warn-component warning" onClick={shareHandler}>
          <i className="fa fa-share" />
        </button>
      </span>
    </Tooltip>
  )
}

ShareDatasetLink.propTypes = {
  datasetId: PropTypes.string,
  url: PropTypes.string,
}

export default ShareDatasetLink
