import Reflux from 'reflux';

var Actions = Reflux.createActions([
	'updateDescription',
	'updateREADME',
	'uploadAttachment',
	'deleteAttachment',
	'downloadAttachment',
	'updateNote',
	'updateFile',
	'saveDescription',
	'loadDataset',
	'loadUsers',
	'publish',
	'deleteDataset',
	'downloadDataset',
	'setInitialState'
]);

export default Actions;