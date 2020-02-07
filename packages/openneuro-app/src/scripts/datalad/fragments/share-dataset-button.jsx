import React from 'react'
import PropTypes from 'prop-types'
import WarnButton from '../../common/forms/warn-button.jsx'

const ShareDatasetLink = props => {
  let { url } = props.url
  return (
    <WarnButton
      tooltip="Share Dataset"
      // icon={following ? 'fa-tag icon-minus' : 'fa-tag icon-plus'}
      warn={false}
      action={async () => {
        try {
          ;(await window.navigator) && window.navigator.share(url)
        } catch (err) {
          console.error(err)
        }
        window.alert('Success!')
      }}></WarnButton>
  )
}

ShareDatasetLink.propTypes = {
  datasetId: PropTypes.string,
  url: PropTypes.string,
}

export default ShareDatasetLink
