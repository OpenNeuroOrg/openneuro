import React from 'react'
import PropTypes from 'prop-types'
import parseISO from 'date-fns/parseISO'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

class Uploaded extends React.PureComponent {
  render() {
    const fullname = this.props.uploader ? this.props.uploader.name : ''
    const dateAdded = this.props.created
      ? new Date(this.props.created).toISOString().split('T')[0]
      : ''
    const timeago = this.props.created
      ? formatDistanceToNow(parseISO(this.props.created))
      : ''
    return (
      <div className="meta-container">
        <p className="date">
          uploaded {this.props.uploader ? 'by ' : ''}
          <span className="name">{fullname}</span> on{' '}
          <span className="time-ago">
            {dateAdded} - {timeago} ago
          </span>
        </p>
      </div>
    )
  }
}

Uploaded.propTypes = {
  uploader: PropTypes.object,
  created: PropTypes.string,
}
export default Uploaded
