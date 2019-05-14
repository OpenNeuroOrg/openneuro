/**
 * Return an equivalent to moment(date).format('L') without moment
 * @param {*} dateObject
 */
export const formatDate = dateObject =>
  new Date(dateObject).toISOString().split('T')[0]
