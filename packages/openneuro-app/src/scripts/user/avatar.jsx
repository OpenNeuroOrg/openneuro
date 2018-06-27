import React from 'react'
import PropTypes from 'prop-types'
import user from '../utils/user.js'

export default class Avatar extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    let profile = this.props.profile

    if (!profile) {
      return null
    }
    let imageUrl = user.generateGravatarUrl(profile)
    let thumbnail
    if (imageUrl) {
      let username = profile && profile.name ? profile.name : null
      thumbnail = (
        <img src={imageUrl} alt={username} className="user-img-thumb" />
      )
    } else {
      let firstLetter =
        profile && profile.name ? profile.name.slice(0, 1) : null
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
