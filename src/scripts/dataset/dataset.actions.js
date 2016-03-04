import Reflux from 'reflux';

var Actions = Reflux.createActions([
	'addFile',
	'createSnapshot',
	'deleteAttachment',
	'deleteDataset',
	'deleteFile',
	'dismissError',
	'getAttachmentDownloadTicket',
	'getDatasetDownloadTicket',
	'getFileDownloadTicket',
	'getResultDownloadTicket',
	'loadDataset',
	'loadSnapshot',
	'loadUsers',
	'publish',
	'reloadDataset',
	'saveDescription',
	'setInitialState',
	'startJob',
	'trackDownload',
	'trackView',
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