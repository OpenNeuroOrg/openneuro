import Reflux from 'reflux';

var Actions = Reflux.createActions([
	'onChange',
	'validate',
	'upload',
	'uploadComplete',
	'uploadError',
	'closeAlert',
	'updateDirName',
	'toggleNameInput',
	'checkExists'
]);

export default Actions;