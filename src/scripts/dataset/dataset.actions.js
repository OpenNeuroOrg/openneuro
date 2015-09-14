import Reflux from 'reflux';

var Actions = Reflux.createActions([
	'updateDescription',
	'updateAttachments',
	'deleteAttachment',
	'updateREADME',
	'saveDescription',
	'loadDataset',
	'loadUsers',
	'publish',
	'deleteDataset',
	'setInitialState'
]);

export default Actions;