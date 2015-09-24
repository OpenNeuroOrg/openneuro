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
		let browse = (
			<button className="btn-admin" onClick={Actions.signIn} >
				<span>Browse Publicly</span>
			</button>
		);
		let google = (
			<button className="btn-admin" onClick={Actions.signIn} >
				<i className="fa fa-google" />
				<span> Google</span>
			</button>
		);
		let form;
		if (!this.state.loading) {
			form = (
				<div className="form">
					{google}
					{browse}
				</div>
			)
		}


		return (
			<div className="sign-in">
				<div className="intro">
					<div className="intro-inner fadeIn clearfix">
						<div className="welcomeBlock flipInX">
							<h1>Welcome To CRN.</h1>
							<h2>This some welcome text to explain what is what. Please do this thing to do some other thing here.</h2>
						</div>
						<div className="col-sm-12 signInBlock fadeIn">
							<h2>Sign In with</h2>
							{form}
							<Spinner text="Signing in..." active={this.state.loading} />
						</div>
					</div>
					
					<div className="intro-teasers clearfix">
						<div className="container maxed">
							<div className="col-md-4 fadeInUp">
								<img src="./assets/colab.png" alt="data" />
								<h4 className="clearfix">Colaborate, Share, and Study</h4>
								<p>Enhance your research through collaboration. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an </p>
							</div>
							<div className="col-md-4 fadeInUp">
								<img src="./assets/server.png" alt="data" />
								<h4 className="clearfix">Utilizing Powerful Servers</h4>
								<p>Agave provides hosted services that allow researchers to manage data, conduct experiments, and publish and share results from anywhere at any time. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an </p>
							</div>
							<div className="col-md-4 fadeInUp">
								<img src="./assets/data.png" alt="data" />
								<h4 className="clearfix">Get Results</h4>
								<p>Powerful algorithms to produce substantial data. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an </p>
							</div>
						</div>
					</div>	
				</div>
			</div>
    	);
	},

});

export default Signin;