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
			return <div key={index}>{item} <button onClick={this._remove.bind(null, index)}>x</button></div>
		});

		return (
			<div>
				<div>
					{items}
				</div>
				<input type="text" ref="input"/>
				<button onClick={this._add}>add</button>
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