import crypto from 'crypto'
export default {
  /**
   * Generate Gravatar Url
   *
   * Given a user profile, generate a gravatar identicon url
   * to use as source for an image
   */
  generateGravatarUrl(userProfile) {
    const email = userProfile.email
    if (email) {
      const hash = crypto
        .createHash('md5')
        .update(email)
        .digest('hex')
      const gravatarUrl = `https://www.gravatar.com/avatar/${hash}?s=200&d=identicon`
      return gravatarUrl
    } else {
      return null
    }
  },
}
