import Reflux from 'reflux';

var Actions = Reflux.createActions([
    'checkUser',
    'checkAuth',
    'getPreferences',
    'updatePreferences',
    'hasToken',
    'initOAuth',
    'signIn',
    'signOut',
    'toggleModal'
]);

export default Actions;