// dependencies -------------------------------------------------------

import React from 'react'
import Input from './input.component.jsx';

// component setup ----------------------------------------------------

let ArrayInput = React.createClass({

// life cycle events --------------------------------------------------

	getInitialState () {
		return {
			name: '',
			ORCIDID: ''
		};
	},

	getDefaultProps () {
		return {value: []};
	},

	render() {
		let items = this.props.value.map((item, index) => {
			return <div key={index} className="cte-array-item">{item.name} {item.ORCIDID ? '-' : null} {item.ORCIDID} <button className="cte-remove-button btn btn-admin warning" onClick={this._remove.bind(null, index)}><i className="fa fa-times"></i></button></div>
		});

		return (
			<div className="cte-edit-array">
				<div className="cte-array-items">{items}</div>
				<Input placeholder="name" value={this.state.name} onChange={this._handleChange.bind(null, 'name')} />
				<Input placeholder="ORCID ID" value={this.state.ORCIDID} onChange={this._handleChange.bind(null, 'ORCIDID')} />
				<button className="btn btn-admin add" onClick={this._add}>add</button>
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
		let value = this.props.value;
		value.push(this.state);
		this.props.onChange({target: {value: value}});
		this.setState(this.getInitialState());
	},

	_remove(index) {
		let array = this.props.value;
		array.splice(index, 1);
		this.setState({value: array});
	}

});

export default ArrayInput;