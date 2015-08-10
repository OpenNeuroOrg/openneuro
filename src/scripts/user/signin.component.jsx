// dependencies -------------------------------------------------------

import React        from 'react';
import Actions      from './user.actions.js';
import UserStore    from './user.store.js';

export default class Signin extends React.Component {

// life cycle events --------------------------------------------------

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