import Reflux from 'reflux';

var Actions = Reflux.createActions([
	'onChange',
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
	'selectPanel',
	'setRefs'
]);

export default Actions;