// dependencies -------------------------------------------------------

import React     from 'react';
import Reflux    from 'reflux';
import Actions   from './user.actions.js';
import userStore from './user.store.js';
import {Link}    from 'react-router';
import Spinner   from '../common/partials/spinner.jsx';

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
                <span>
                    <button className="btn-admin" onClick={Actions.signIn} >
                        <i className="fa fa-google" /> Sign in
                    </button>
                </span>
            );
        }
        let error;
        if (this.state.signinError && !this.state.loading) {
            error = <div className="alert alert-danger">{this.state.signinError}</div>;
        }

        return (
            <div className="sign-in">
                <div className="intro">
                    <div className="intro-bg">
                        <div className="intro-inner fade-in clearfix">
                            <div className="clearfix welcome-block flipin-x">
                                <h1>Welcome to CRN</h1>
                                <p>A free and open platform that enables the analysis and sharing of neuroimaging data</p>
                                <div className="sign-in-block fade-in">
                                    {error}
                                    {form}
                                    <Spinner text="Signing in..." active={this.state.loading} />
                                </div>
                                <div className="browse-publicly">
                                    <Link to="public"><span>Browse Publicly</span></Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="more-info col-xs-12">
                        View more information about <a href="http://reproducibility.stanford.edu/" target="_blank">Stanford Center for Reproducible Neuroscience</a> and <a href="http://bids.neuroimaging.io/" target="_blank">BIDS Specifications</a>
                    </div>
                </div>
            </div>
        );
    }
});

export default Signin;