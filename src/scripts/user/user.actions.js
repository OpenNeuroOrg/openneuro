import Reflux from 'reflux';

var Actions = Reflux.createActions([
	'checkUser',
	'signIn',
	'signOut',
	'toggleModal',
	'initOAuth',
	'hasToken'
]);

export default Actions;