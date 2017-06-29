import Reflux from 'reflux';

var Actions = Reflux.createActions([
    'blacklistSubmit',
    'blacklistUser',
    'blacklistModal',
    'filterAdmin',
    'getUsers',
    'getBlacklist',
    'inputChange',
    'removeUser',
    'searchUser',
    'submitJobDefinition',
    'editJobDefinition',
    'deleteJobDefinition',
    'toggleModal',
    'toggleSuperUser',
    'unBlacklistUser',
    'update'
]);

export default Actions;
