import Reflux from 'reflux';

var Actions = Reflux.createActions([
	'addFile',
	'deleteAttachment',
	'deleteDataset',
	'deleteFile',
	'dismissError',
	'downloadAttachment',
	'downloadDataset',
	'downloadResult',
	'loadDataset',
	'loadUsers',
	'publish',
	'reloadDataset',
	'saveDescription',
	'setInitialState',
	'startJob',
	'toggleFolder',
	'toggleModal',
	'uploadAttachment',
	'updateDescription',
	'updateNote',
	'updateFile',
	'updateREADME',
]);

export default Actions;