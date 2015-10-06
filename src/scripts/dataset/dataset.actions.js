import Reflux from 'reflux';

var Actions = Reflux.createActions([
	'updateDescription',
	'uploadAttachment',
	'deleteAttachment',
	'downloadAttachment',
	'updateNote',
	'saveDescription',
	'loadDataset',
	'loadUsers',
	'publish',
	'deleteDataset',
	'downloadDataset',
	'setInitialState'
]);

export default Actions;