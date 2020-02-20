import React from 'react'
import PropTypes from 'prop-types'
import user from '../utils/user.js'

export default class Avatar extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const profile = this.props.profile

    if (!profile) {
      return null
    }
    const imageUrl = user.generateGravatarUrl(profile)
    let thumbnail
    if (imageUrl) {
      const username = profile && profile.name ? profile.name : null
      thumbnail = (
        <img src={imageUrl} alt={username} className="user-img-thumb" />
      )
    } else {
      const firstLetter =
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
