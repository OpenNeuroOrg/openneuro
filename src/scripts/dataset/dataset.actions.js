import Reflux from 'reflux';

var Actions = Reflux.createActions([
	'updateDescription',
	'saveDescription',
	'loadDataset',
	'loadUsers',
	'publish',
	'deleteDataset',
	'setInitialState'
]);

export default Actions;