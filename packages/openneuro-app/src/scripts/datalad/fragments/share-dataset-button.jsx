import React from 'react'
import PropTypes from 'prop-types'
import WarnButton from '../../common/forms/warn-button.jsx'
import Tooltip from '../../common/partials/tooltip.jsx'

var webShare = 'share' in navigator

const ShareDatasetLink = props => {
  let { url } = props.url
  var share = {
    title: '',
    text: '',
    url: url,
  }

  const shareHandler = () => {
    if (webShare) {
      navigator
        .share(share)
        .then(window.alert('Successful share'))
        .catch(err => window.alert(err))
    } else {
      window.alert('share is not supported on your device')
    }
  }
  return (
    <div>
      <span className="disabled">
        <button className="btn-warn-component warning">
          <i className="fa-share" />
        </button>
      </span>
      <Tooltip tooltip="Share Dataset"></Tooltip>

      {/* 
    <WarnButton
      tooltip="Share Dataset"
      icon={'fa-share'}
      warn={false}
      onClick={() => shareHandler()}>
    
      </WarnButton> */}
    </div>
  )
}

ShareDatasetLink.propTypes = {
  datasetId: PropTypes.string,
  url: PropTypes.string,
}

export default ShareDatasetLink
