import Reflux from 'reflux';

var Actions = Reflux.createActions([
	'addFile',
	'createSnapshot',
	'deleteAttachment',
	'deleteDataset',
	'deleteFile',
	'dismissError',
	'downloadResult',
	'getAttachmentDownloadTicket',
	'getDatasetDownloadTicket',
	'getFileDownloadTicket',
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