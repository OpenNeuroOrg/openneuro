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

        let profile = this.props.profile;
        if (!profile) {return false;}

        let thumbnail,
            username = profile.displayName;

        if (profile.picture) {
            thumbnail = profile.picture.replace('sz=50', 'sz=200');
        }

        let gear = (<i className="fa fa-gear" />);

        return (
            <ul className="clearfix user-wrap">
                <img src={thumbnail} alt={username} className="user-img-thumb" />
                <DropdownButton bsClass="user-menu btn-null" title={gear} id="user-menu">
                    <li role="presentation" className="dropdown-header">Hello <br/>{username}</li>
                    <li role="separator" className="divider"></li>
                    <li><a onClick={this._signOut} className="btn-submit-other">Sign Out</a></li>
                </DropdownButton>
            </ul>
        );
    },

// custom methods ----------------------------------------------------------------

    _signOut: function () {
        Actions.signOut(uploadStore.data.uploadStatus);
    }

});

export default Usermenu;


// <ul>
//                 <li className="clearfix user-wrap">
//                     <img src={thumbnail} alt={username} className="user-img-thumb" />
//                     <DropdownButton className="user-menu btn-null" key={1} title={gear} id="test">
//                         <li role="presentation" className="dropdown-header">Hello <br/>{username}</li>
//                         <li role="separator" className="divider"></li>
//                         <li><a onClick={this._signOut} className="btn-submit-other">Sign Out</a></li>
//                     </DropdownButton>
//                 </li>
//             </ul>