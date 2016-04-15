import Reflux from 'reflux';

var Actions = Reflux.createActions([
    'onChange',
    'onResume',
    'validate',
    'upload',
    'uploadComplete',
    'uploadError',
    'updateDirName',
    'checkExists',
    'setInitialState',
    'selectTab',
    'setRefs',
    'toggleModal'
]);

export default Actions;