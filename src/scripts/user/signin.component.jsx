// dependencies -------------------------------------------------------

import React     from 'react';
import Reflux    from 'reflux';
import Actions   from './user.actions.js';
import userStore from './user.store.js';
import Spinner   from '../common/partials/spinner.component.jsx';

// component setup ----------------------------------------------------

let Signin = React.createClass({

    mixins: [Reflux.connect(userStore)],

// life cycle events --------------------------------------------------
	
	statics: {
		willTransitionTo(transition) {
			if (userStore.data.token) {
				transition.redirect('dashboard');
			}
		}
	},

	render () {
		let form;
		if (!this.state.loading) {
			form = (
				<div>
					<h2>Login</h2>
					<button className="btn-blue" onClick={Actions.signIn} >
						<i className="fa fa-google" />
						<span> Google</span>
					</button>
				</div>
			)
		}

		return (
			<div className="signInBlock fadeIn inner-route">
	    		{form}
				<Spinner text="Signing in..." active={this.state.loading} />
			</div>
    	);
	},

});

export default Signin;