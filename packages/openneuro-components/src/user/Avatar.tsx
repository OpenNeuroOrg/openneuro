import React from 'react'
import { generateGravatarUrl } from '../../../openneuro-app/src/scripts/utils/user.js'

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
