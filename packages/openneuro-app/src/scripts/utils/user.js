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
