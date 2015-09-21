import Reflux from 'reflux';

var Actions = Reflux.createActions([
	'checkUser',
	'signIn',
	'signUp',
	'signOut',
	'initOAuth',
	'loggedIn'
]);

export default Actions;