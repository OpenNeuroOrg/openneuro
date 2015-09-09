import Reflux from 'reflux';

var Actions = Reflux.createActions([
	'updateDescription',
	'updateREADME',
	'saveDescription',
	'loadDataset',
	'loadUsers',
	'publish',
	'deleteDataset',
	'setInitialState'
]);

export default Actions;