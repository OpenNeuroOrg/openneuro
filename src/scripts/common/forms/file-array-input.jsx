// dependencies -------------------------------------------------------

import React  from 'react';
import upload from '../../utils/upload';

// component setup ----------------------------------------------------

let FileArrayInput = React.createClass({

// life cycle events --------------------------------------------------

	getDefaultProps () {
		return {value: []};
	},

	render() {
		let items = this.props.value.map((item, index) => {
			return <div key={index} className="cte-array-item">{item.name} <button className="cte-remove-button btn btn-admin warning" onClick={this._remove.bind(null, index)}><i className="fa fa-times"></i></button></div>
		});

		return (
			<div className="cte-edit-array">
				<div className="cte-array-items">
					{items}
				</div>
				<input type="file" onChange={this._handleChange}/>
			</div>
		)
	},

// custon methods -----------------------------------------------------

	_handleChange(e) {
		let file = e.target.files[0];
		if (this.props.onChange) {this.props.onChange(file);}
	},

	_remove(index) {
		let array = this.props.value;
		array.splice(index, 1);
		this.setState({value: array});
	}

});

export default FileArrayInput;