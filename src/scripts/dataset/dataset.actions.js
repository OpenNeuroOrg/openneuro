import Reflux from 'reflux';

var Actions = Reflux.createActions([
	'updateDescription',
	'updateDigitalDocuments',
	'deleteDigitalDocument',
	'updateREADME',
	'saveDescription',
	'loadDataset',
	'loadUsers',
	'publish',
	'deleteDataset',
	'setInitialState'
]);

export default Actions;