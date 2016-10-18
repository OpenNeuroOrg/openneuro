// dependencies -------------------------------------------------------

import React       from 'react';
import Reflux      from 'reflux';
import {Link}      from 'react-router';
import uploadStore from '../../upload/upload.store.js';
import Actions     from '../../user/user.actions.js';
import userStore   from '../../user/user.store.js';
import packageJson from '../../../../package.json';


let Footer = React.createClass({

    mixins: [Reflux.connect(userStore)],

// life cycle events --------------------------------------------------

    render () {

        let showSignOut = !!this.state.token && !this.state.loading;

        return (
            <span>
            <footer>
                <div className="row">
                    <div className="col-xs-12 col-md-4 version">
                        <span>OpenNeuro Beta v.{packageJson.version}</span>
                    </div>
                    <div className="col-xs-12 col-md-4 footer-menu">
                        <ul>
                            <li> {showSignOut ? <a onClick={this._signOut}>Sign Out</a> : <a onClick={userStore.signIn.bind(null)} >Sign in</a>}</li>
                            <li><Link to="public">Browse</Link></li>
                            <li>About</li>
                            <li>Privacy</li>
                            <li>Terms</li>
                        </ul>
                    </div>
                    <div className="col-xs-12 col-md-4 copy">
                        <span>&copy; 2016 Stanford Center for Reproducible Neuroscience</span>
                    </div>
                </div>
            </footer>
            </span>
        );
    },

    _signOut(){
        Actions.signOut(uploadStore.data.uploadStatus);
    }
});

export default Footer;