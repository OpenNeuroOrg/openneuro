// dependencies ------------------------------------------------------------------

import React            from 'react';
import Reflux           from 'reflux';
import Actions          from '../user/user.actions.js';
import userStore        from '../user/user.store.js';
import uploadStore      from '../upload/upload.store.js';
import {DropdownButton} from 'react-bootstrap';

// component setup ---------------------------------------------------------------

let Usermenu = React.createClass({

    mixins: [Reflux.connect(userStore)],

// life cycle methods ------------------------------------------------------------

    render: function () {

        let thumbnail,
            username = this.state.google.displayName;

        if (this.state.google.picture) {
            thumbnail = this.state.google.picture.replace('sz=50', 'sz=200');
        }

        let gear = (<i className="fa fa-gear" />);

        return (
            <li className="clearfix user-wrap">
                <img src={thumbnail} alt={username} className="user-img-thumb" />
                <DropdownButton className="user-menu btn-null" eventKey={1} title={gear}>
                    <li role="presentation" className="dropdown-header">Hello <br/>{username}</li>
                   <li role="separator" className="divider"></li>
                   <li><a onClick={this._signOut} className="btn-submit-other">Sign Out</a></li>
                </DropdownButton>
            </li>
        );
    },

// custom methods ----------------------------------------------------------------

    _signOut: function () {
        Actions.signOut(uploadStore.data.uploadStatus);
    }

});

export default Usermenu;
