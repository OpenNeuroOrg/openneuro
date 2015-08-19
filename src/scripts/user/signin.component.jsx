// dependencies -------------------------------------------------------

import React        from 'react';
import Actions      from './user.actions.js';
import userStore    from './user.store.js';

export default class Signin extends React.Component {

// life cycle events --------------------------------------------------
	
	static willTransitionTo(transition) {
		if (userStore.data.token) {
			transition.redirect('dashboard');
		}
	}

	render () {
		return (
			<div className="signInBlock fadeIn inner-route">
				<h2>Login</h2>
	    		<button className="btn-blue" onClick={this._signIn} >
					<i className="fa fa-google" />
					<span> Google</span>
				</button>
			</div>
    	);
	}

// custom methods -----------------------------------------------------

	_signIn () {
		Actions.signIn();
	}
}