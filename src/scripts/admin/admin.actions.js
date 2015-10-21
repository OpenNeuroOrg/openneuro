import Reflux from 'reflux';

var Actions = Reflux.createActions([
	'addUser',
	'blacklistSubmit',
	'blacklistUser',
	'blacklistModal',
	'clearForm',
	'getUsers',
	'getBlacklist',
	'inputChange',
	'removeUser',
	'toggleSuperUser',
	'unBlacklistUser',
	'update'
]);

export default Actions;