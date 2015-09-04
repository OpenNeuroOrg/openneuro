// dependencies -------------------------------------------------------
	
import React from 'react';

// component setup ----------------------------------------------------

export default class Typeahead extends React.Component {
	
	constructor() {
		super();
		this.state = {
			results: []
		};
	}

// life cycle events --------------------------------------------------

	render() {
		let results = this.state.results.map((result) => {
			return <li key={result} onClick={this._select.bind(this, result)}>{result}</li>;
		});

		return (
			<div className="typeahead">
				<input onChange={this._handleInput.bind(this)} value={this.props.value}/>
				<ul className="typeahead-results">{results}</ul>
			</div>
		)
	}

// custon methods -----------------------------------------------------

	_handleInput(e) {
		let value = e.target.value;
		let options = this.props.options;
		let results = [];
		for (let option of options) {
			if (this.props.filter(option, value)) {
				let result = this._format(option, this.props.format);
				results.push(result);
			}
		}
		this.props.onChange(value);
		this.setState({results});
	}

	_select(result) {
		this.props.onChange(result);
		this.setState({results: []});
	}

	_format(obj, propString) {
		if (!propString) {return obj;}
		let props = propString.split('.');
		for (let prop of props) {
			let candidate = obj[prop];
			if (candidate !== undefined) {
				obj = candidate;
			} else {
				break;
			}
		}
		return obj;
	}

}