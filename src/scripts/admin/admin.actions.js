import Reflux from 'reflux';

var Actions = Reflux.createActions([
    'blacklistSubmit',
    'blacklistUser',
    'blacklistModal',
    'getUsers',
    'getBlacklist',
    'inputChange',
    'removeUser',
    'toggleSuperUser',
    'unBlacklistUser',
    'update',
    'searchUser',
    'filterAdmin'
]);

export default Actions;