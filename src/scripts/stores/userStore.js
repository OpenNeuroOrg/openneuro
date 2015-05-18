import Reflux from 'reflux';
import Actions from '../actions/Actions';

var UserStore = Reflux.createStore({
	listenables: Actions,
	signIn: function () {

	},
	signOut: function () {

	}
});

export default UserStore;