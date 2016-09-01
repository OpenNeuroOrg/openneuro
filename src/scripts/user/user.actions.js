import Reflux from 'reflux';

var Actions = Reflux.createActions([
    'checkAuth',
    'getPreferences',
    'isRoot',
    'updatePreferences',
    'refresh',
    'signIn',
    'signOut'
]);

export default Actions;