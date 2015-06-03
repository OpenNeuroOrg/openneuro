import Reflux from 'reflux';

var Actions = Reflux.createActions([
	'signIn',
	'signOut',
	'isLoggedIn',
	'logToken',
	'testScitran'
]);

export default Actions;