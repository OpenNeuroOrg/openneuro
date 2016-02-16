import Reflux from 'reflux';

var Actions = Reflux.createActions([
	'addFile',
	'createSnapshot',
	'deleteAttachment',
	'deleteDataset',
	'deleteFile',
	'dismissError',
	'downloadAttachment',
	'downloadDataset',
	'downloadFile',
	'downloadResult',
	'getDatasetDownloadTicket',
	'loadDataset',
	'loadSnapshot',
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
	'updateName',
	'updateNote',
	'updateFile',
	'updateREADME',
]);

export default Actions;