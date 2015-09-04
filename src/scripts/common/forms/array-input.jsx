// dependencies -------------------------------------------------------

import React from 'react'

// component setup ----------------------------------------------------

let ArrayInput = React.createClass({

// life cycle events --------------------------------------------------

	getDefaultProps () {
		return {value: []};
	},

	render() {
		let items = this.props.value.map((item, index) => {
			return <div key={index} className="cte-array-item">{item} <button className="cte-remove-button btn btn-admin warning" onClick={this._remove.bind(null, index)}><i className="fa fa-times"></i></button></div>
		});

		return (
			<div>
				<div className="cte-array-items">
					{items}
				</div>
				<input type="text" ref="input"/>
				<button className="btn btn-admin add" onClick={this._add}>add</button>
			</div>
		)
	},

// custon methods -----------------------------------------------------

	_add() {
		let input = this.refs.input.getDOMNode().value;
		let value = this.props.value;
		value.push(input);
		this.props.onChange({target: {value: value}});
		this.refs.input.getDOMNode().value = '';
	},

	_remove(index) {
		let array = this.props.value;
		array.splice(index, 1);
		this.setState({value: array});
	}

});

export default ArrayInput;