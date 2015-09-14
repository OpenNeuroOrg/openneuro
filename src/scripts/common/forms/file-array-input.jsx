// dependencies -------------------------------------------------------

import React   from 'react';
import upload  from '../../utils/upload';
import Actions from '../../dataset/dataset.actions';

// component setup ----------------------------------------------------

let FileArrayInput = React.createClass({

// life cycle events --------------------------------------------------

	getDefaultProps () {
		return {
			value: []
		};
	},

	render() {
		let items = this.props.value.map((item, index) => {
			return (
				<div key={index} className="cte-array-item">
					{item.name}
					<button className="cte-remove-button btn btn-admin warning" onClick={this._remove.bind(null, item.name, index)}>
						<i className="fa fa-times"></i>
					</button>
				</div>
			);
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

	_remove(filename, index) {
		if (this.props.onDelete) {
			this.props.onDelete(filename, index);
		}
	}

});

export default FileArrayInput;