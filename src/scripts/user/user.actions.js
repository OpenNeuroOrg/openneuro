import Reflux from 'reflux';

var Actions = Reflux.createActions([
    'checkAuth',
    'getPreferences',
    'isRoot',
    'updatePreferences',
    'refresh',
    'signIn',
    'signOut',
    'toggleModal'
]);

export default Actions;