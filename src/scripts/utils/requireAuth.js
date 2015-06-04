// dependencies ----------------------------------------------------

import React from 'react';
import userStore from '../stores/userStore';

// require auth ----------------------------------------------------

var requireAuth = (Component) => {
	return class Authenticated extends React.Component {
		static willTransitionTo(transition) {
			if (!userStore._token) { // if not logged in
				transition.redirect('/signin', {});
			}
		}
		render () {
			return <Component />
		}
	}
};

export default requireAuth;