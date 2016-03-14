// dependencies -------------------------------------------------------

import React      from 'react'
import Input      from './input.jsx';
import WarnButton from './warn-button.jsx';

// component setup ----------------------------------------------------

let ArrayInput = React.createClass({

// life cycle events --------------------------------------------------

	getInitialState () {
		return {
			name: '',
			ORCIDID: '',
			error: null
		};
	},

	getDefaultProps () {
		return {value: []};
	},

	render() {
		let items = this.props.value.map((item, index) => {
			return (
				<Author key={index} index={index} item={item} onEdit={this._edit} remove={this._remove.bind(null, index)} />
			);
		});

		return (
			<div className="cte-edit-array">
				<div className="cte-array-items">{items}</div>
				<div className="text-danger">{this.state.error}</div>
				<div className="form-inline">
					<Input placeholder="name" value={this.state.name} onChange={this._handleChange.bind(null, 'name')} />
					<Input placeholder="ORCID ID" value={this.state.ORCIDID} onChange={this._handleChange.bind(null, 'ORCIDID')} />
					<button className="cte-save-btn btn-admin-blue " onClick={this._add}>add</button>
				</div>
			</div>
		)
	},

// custom methods -----------------------------------------------------

	_handleChange(key, event) {
		let state = {};
		state[key] = event.target.value;
		this.setState(state);
	},

	_add() {
		this.setState({error: null});

		if (this.state.name.length < 1) {
			this.setState({error: 'An author name is required.'});
			return
		}

		let value = this.props.value;
		value.push({name: this.state.name, ORCIDID: this.state.ORCIDID});
		this.props.onChange({target: {value: value}});
		this.setState(this.getInitialState());
	},

	_remove(index) {
		let array = this.props.value;
		array.splice(index, 1);
		this.props.onChange({target: {value: array}});
	},

	_edit(index, value) {
		let authors = this.props.value;
		authors[index] = value;
		this.props.onChange({target: {value: authors}})
	}

});

export default ArrayInput;


/**
 * Author
 *
 * Sub component of Author Input used to manage
 * interactions on individual Authors.
 */
let Author = React.createClass({

	getInitialState() {
	    return {
	        edit: false,
			name: this.props.item.name,
			ORCIDID: this.props.item.ORCIDID
	    };
	},

	render() {
		let item = this.props.item;

		let view = (
			<div className="cte-array-item"><span className="author-name">{item.name}</span> <span className="orcid-id">{item.ORCIDID ? '-' : null} {item.ORCIDID}</span>
				<div className="btn-wrap">
					<WarnButton message="Remove" cancel="Cancel" confirm="Yes Remove!" action={this.props.remove}/>
				</div>
				<div className="btn-wrap">
					<WarnButton message="Edit" warn={false} icon="fa-pencil" action={this._toggleEdit}/>
				</div>
			</div>
		);

		let edit = (
			<div className="cte-array-item">
				<div className="form-inline">
					<Input placeholder="name" value={this.state.name} onChange={this._handleChange.bind(null, 'name')} />
					<Input placeholder="ORCID ID" value={this.state.ORCIDID} onChange={this._handleChange.bind(null, 'ORCIDID')} />
					<div className="btn-wrap author-edit">
						<WarnButton message="Save" warn={false} icon="fa-check" action={this._save}/>
					</div>
					<div className="btn-wrap author-edit">
						<WarnButton message="Cancel" warn={false} icon="fa-times" action={this._cancel}/>
					</div>
				</div>
			</div>

		);

		return this.state.edit ? edit : view;
	},

	_cancel() {
		this._toggleEdit();
		this.setState(this.getInitialState());
	},

	_toggleEdit() {
		this.setState({edit: !this.state.edit});
	},

	_handleChange(key, event) {
		let state = {};
		state[key] = event.target.value;
		this.setState(state);
	},

	_save() {
		this.props.onEdit(this.props.index, {ORCIDID: this.state.ORCIDID, name: this.state.name});
	}

});