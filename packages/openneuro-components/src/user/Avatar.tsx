import React from 'react'
import md5 from 'md5'

/**
 * Generate Gravatar Url
 *
 * Given a user profile, generate a gravatar identicon url
 * to use as source for an image
 */
export function generateGravatarUrl(userProfile) {
  const email = userProfile.email
  if (email) {
    const hash = md5(email)
    const gravatarUrl = `https://www.gravatar.com/avatar/${hash}?s=200&d=identicon`
    return gravatarUrl
  } else {
    return null
  }
}

export interface AvatarProps {
  profile: {
    name: string
  }
}

export const Avatar = ({ profile }: AvatarProps) => {
  if (!profile) {
    return null
  }
  const imageUrl = generateGravatarUrl(profile)
  let thumbnail
  if (imageUrl) {
    const username = profile?.name
    thumbnail = <img src={imageUrl} alt={username} className="user-img-thumb" />
  } else {
    const firstLetter = profile?.name.slice(0, 1)
    thumbnail = (
      <div className="user-generic-thumb">
        <div className="user-generic-thumb-letter">{firstLetter}</div>
      </div>
    )
  }
  return thumbnail
}
