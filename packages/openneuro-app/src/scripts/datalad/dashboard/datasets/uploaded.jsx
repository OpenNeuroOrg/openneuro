import React from 'react'
import PropTypes from 'prop-types'
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now'

const Uploaded = ({ uploader, created }) => {
  const fullname = uploader ? uploader.name : ''
  const dateAdded = created ? new Date(created).toISOString().split('T')[0] : ''
  const timeago = created ? distanceInWordsToNow(created) : ''
  return (
    <div className="meta-container">
      <p className="date">
        uploaded {uploader ? 'by ' : ''}
        <span className="name">{fullname}</span> on{' '}
        <span className="time-ago">
          {dateAdded} - {timeago} ago
        </span>
      </p>
    </div>
  )
}

Uploaded.propTypes = {
  uploader: PropTypes.object,
  created: PropTypes.string,
}
export default Uploaded
