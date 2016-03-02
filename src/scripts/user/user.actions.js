import Reflux from 'reflux';

var Actions = Reflux.createActions([
	'checkUser',
	'checkAuth',
	'signIn',
	'signOut',
	'toggleModal',
	'initOAuth',
	'hasToken'
]);

export default Actions;