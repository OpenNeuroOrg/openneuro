// dependencies ----------------------------------------------------

import React from 'react';
import userStore from '../user/user.store.js';

// require auth ----------------------------------------------------

var requireAuth = (Component) => {
	return class Authenticated extends React.Component {
		static willTransitionTo(transition) {
			if (!userStore._token) { // if not logged in
				transition.redirect('signIn', {});
			}
		}
		render () {
			return <Component />
		}
	}
};

export default requireAuth;