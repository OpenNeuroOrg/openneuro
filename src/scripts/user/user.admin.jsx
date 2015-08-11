// dependencies -------------------------------------------------------

import React     from 'react';
import Actions   from './user.actions.js';
import UserStore from './user.store.js';
import Input     from '../common/forms/input.component.jsx';
import {Panel}  from 'react-bootstrap';
import scitran   from '../utils/scitran';

export default class AddUser extends React.Component {

	constructor() {
		super();
		this.state = {
			users: [],
			showDeleteBtn: false,
			newUser: {
				_id: '',
				firstname: '',
				lastname: ''
			}
		};
	}

// life cycle events --------------------------------------------------

	componentDidMount () {
		let self = this;
		scitran.getUsers(function (err, res) {
			self.setState({users: res.body});
		});
	}

	render () {
		let self = this;
		let showDeleteBtn = this.state.showDeleteBtn;
		let users = this.state.users.map(function (user, index) {
			
		let hideDeleteBtn = (
        	<div className="btn-group slideInRightFast" role="group" >
        		<button className="btn btn-admin cancel" onClick={self._dismissDelete.bind(self, user, index)}>Cancel</button>
        		<button className="btn btn-admin delete" onClick={self._removeUser.bind(self, user._id, index)}>Yes Delete!</button>
        	</div>
        )
        let viewdeleteBtn = (
        	<div className=" fadeIn" >
        		 <button className="btn btn-admin warning" onClick={self._showDelete.bind(self, user, index)}>Delete this User <i className="fa fa-trash-o"></i> </button>
        	</div>
        )

        let userName = (
			<div className="userName">
				<span>{user.firstname}</span> &nbsp;
				<span>{user.lastname}</span>
				<div className="badge">{user.wheel === true ? 'Admin' : null }</div>
			</div>
        );

			return (

			    <div className="fadeIn user-panel clearfix" key={index}>
                    <div className="col-sm-4 user-col">
                    	<h3>{userName}</h3>
                    </div>
                    <div className="col-sm-4 user-col middle">
	                    <h3 className="user-email">{user._id}</h3>
                    </div>
                    <div className="col-sm-4 user-col last">
	                    <h3 className="user-delete">{user.showDeleteBtn ? hideDeleteBtn : viewdeleteBtn}</h3>
                    </div>
                </div>
			);
		});



		return (
			<div className="fadeIn inner-route admin clearfix">
				<h2>Add A New User</h2>
				<div>
					<div className="col-sm-4 add-user">
						<div>
							<Input placeholder="gmail address" type='email' required value={this.state.newUser._id}       name={'_id'}       onChange={this._inputChange.bind(this)} />
							<Input placeholder="first name"    type="text" value={this.state.newUser.firstname} name={'firstname'} onChange={this._inputChange.bind(this)} />
							<Input placeholder="last name"     type="text" value={this.state.newUser.lastname}  name={'lastname'}  onChange={this._inputChange.bind(this)} />
				    		<button className="btn-blue" onClick={this._addUser.bind(this)} >
								<span>Add User</span>
							</button>
						</div>
					</div>
					<div className="col-sm-8 users-card">
					<h2>Current users</h2>
						{users}
					</div>
				</div>
			</div>
    	);
	}

// custom methods -----------------------------------------------------

	/**
	 * Add User
	 *
	 * Takes a gmail address and a first and last
	 * name and adds the user as a user.
	 */
	_addUser () {
		let self = this;
		scitran.addUser(this.state.newUser, function (err, res) {
			let users = self.state.users;
			users.push(self.state.newUser);
			self.setState({users: users, newUser: {_id: '', firstname: '', lastname: ''}});
		});
	}        

	/**
	 * Show Delete for User
	 * 
	 */

	_showDelete(user){
    	let self = this;
    	let users = this.state.users;
    	let userIndex;
        for (var i = 0; i < self.state.users.length; i++) {
            if (user._id === self.state.users[i]._id) {
                users[i].showDeleteBtn = true;
                self.setState({users: users});
                userIndex = i;
            }else{
            	users[i].showDeleteBtn = false;
            }
        }
    }
	
	/**
	 * Dismiss Delete User
	 *
	 */

	_dismissDelete(user){
    	let self = this;
    	let users = this.state.users;
  		let userIndex;
        for (var i = 0; i < self.state.users.length; i++) {
            if (user._id === self.state.users[i]._id) {
                users[i].showDeleteBtn = false;
                self.setState({users: users});
                userIndex = i;
            }
        }
    }

	/**
	 * Remove User
	 *
	 * Takes a userId and removes the user.
	 */
	_removeUser (userId, index) {
		let self = this;
		scitran.removeUser(userId, function (err, res) {
			let users = self.state.users;
			users.splice(index, 1);
			self.setState({users: users});
		});
	}

	_inputChange (e) {
		let newUser = this.state.newUser;
		newUser[e.target.name] = e.target.value;
		this.setState({newUser: newUser});
	}

}