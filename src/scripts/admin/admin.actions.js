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
    'searchUsername',
    'toggleAdmin'
]);

export default Actions;