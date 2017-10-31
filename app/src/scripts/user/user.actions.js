import Reflux from 'reflux'

var Actions = Reflux.createActions([
  'checkAuth',
  'getPreferences',
  'isRoot',
  'updatePreferences',
  'refresh',
  'googleSignIn',
  'orcidSignIn',
  'signOut',
  'toggleModal',
])

export default Actions
