import Reflux from 'reflux';

var Actions = Reflux.createActions([
    'checkAuth',
    'getPreferences',
    'updatePreferences',
    'refresh',
    'signIn',
    'signOut'
]);

export default Actions;