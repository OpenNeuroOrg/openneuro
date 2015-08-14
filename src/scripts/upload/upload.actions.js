import Reflux from 'reflux';

var Actions = Reflux.createActions([
	'onChange',
	'onReset',
	'renameTabLink',
	'validate',
	'upload',
	'uploadComplete',
	'uploadError',
	'closeAlert',
	'updateDirName',
	'toggleNameInput',
	'checkExists',
	'setInitialState',
	'selectPanel'
]);

export default Actions;