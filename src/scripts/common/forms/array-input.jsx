// dependencies -------------------------------------------------------

import React from 'react'

// component setup ----------------------------------------------------

let ArrayInput = React.createClass({

// life cycle events --------------------------------------------------

	getDefaultProps () {
		return {value: []};
	},

	getInitialState() {
		return {
			value: this.props.value,
			input: ''
		};
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
				<input type="text" onChange={this._handleInput} />
				<button onClick={this._add}>add</button>
			</div>
		)
	},

// custon methods -----------------------------------------------------

	_handleInput(e) {
		this.setState({input: e.target.value});
	},

	_add() {
		let input = this.state.input;
		let value = this.state.value.push(input);
		this.setState({value: value, input: ''});
	},

	_remove(index) {
		let array = this.state.value;
		array.splice(index, 1);
		this.setState({value: array});
	}

});

export default ArrayInput;