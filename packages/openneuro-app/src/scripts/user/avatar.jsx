import React from 'react'
import PropTypes from 'prop-types'

export default class Avatar extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    let profile = this.props.profile

    if (!profile) {
      return null
    }

    let thumbnail, thumbnailUrl
    if (profile.imageUrl) {
      let username =
        profile && profile.firstName && profile.lastName
          ? profile.firstName + ' ' + profile.lastName
          : null
      thumbnailUrl = profile.imageUrl.replace('sz=50', 'sz=200')
      thumbnail = (
        <img src={thumbnailUrl} alt={username} className="user-img-thumb" />
      )
    } else {
      let firstLetter =
        profile && profile.firstname ? profile.firstname.slice(0, 1) : null
      thumbnail = (
        <div className="user-generic-thumb">
          <div className="user-generic-thumb-letter">{firstLetter}</div>
        </div>
      )
    }
    return thumbnail
  }
}

Avatar.propTypes = {
  profile: PropTypes.object,
}
