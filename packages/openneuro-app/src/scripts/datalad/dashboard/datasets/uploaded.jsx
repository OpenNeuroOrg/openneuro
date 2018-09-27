import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

const Uploaded = ({ uploader, created }) => {
  const fullname = uploader ? uploader.name : ''
  const dateAdded = created ? moment(created).format('L') : ''
  const timeago = created ? moment(created).fromNow(true) : ''
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
