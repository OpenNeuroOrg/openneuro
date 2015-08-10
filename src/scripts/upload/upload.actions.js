import Reflux from 'reflux';

var Actions = Reflux.createActions([
	'onChange',
	'validate',
	'upload',
	'uploadComplete',
	'closeAlert',
	'updateDirName',
	'toggleNameInput',
	'checkExists',
	'setInitialState'
]);

export default Actions;