import Reflux from 'reflux';

var Actions = Reflux.createActions([
	'addUser',
	'blacklistUser',
	'clearForm',
	'getUsers',
	'getBlacklist',
	'inputChange',
	'removeUser',
	'toggleSuperUser'
]);

export default Actions;