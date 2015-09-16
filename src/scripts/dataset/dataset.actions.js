import Reflux from 'reflux';

var Actions = Reflux.createActions([
	'updateDescription',
	'uploadAttachment',
	'deleteAttachment',
	'downloadAttachment',
	'updateREADME',
	'saveDescription',
	'loadDataset',
	'loadUsers',
	'publish',
	'deleteDataset',
	'setInitialState'
]);

export default Actions;