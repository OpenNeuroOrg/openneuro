import Reflux from 'reflux'

var Actions = Reflux.createActions([
  'getPreferences',
  'isRoot',
  'updatePreferences',
  'refresh',
  'googleSignIn',
  'orcidSignIn',
  'signOut',
  'toggle',
])

export default Actions
