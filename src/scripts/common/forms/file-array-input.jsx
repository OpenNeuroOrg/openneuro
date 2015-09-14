// dependencies -------------------------------------------------------

import React   from 'react';
import upload  from '../../utils/upload';
import Spinner from '../../common/partials/spinner.component.jsx';

// component setup ----------------------------------------------------

let FileArrayInput = React.createClass({

// life cycle events --------------------------------------------------

	getDefaultProps () {
		return {
			value: []
		};
	},

	getInitialState() {
		return {
			loading: false
		};
	},

	render() {
		let items = this.props.value.map((item, index) => {
			return (
				<div key={index} className="cte-array-item">
					<a href={item.dataUrl} download={item.name} target="_blank">{item.name}</a>
					<button className="cte-remove-button btn btn-admin warning" onClick={this._remove.bind(null, item.name, index)}>
						<i className="fa fa-times"></i>
					</button>
				</div>
			);
		});

		return (
			<div className="cte-edit-array">
				<div className="cte-array-items">{items}</div>
				{this.state.loading ? <Spinner active={true} /> : <input type="file" onChange={this._handleChange}/>}
			</div>
		)
	},

// custon methods -----------------------------------------------------

	_handleChange(e) {
		let file = e.target.files[0];
		if (this.props.onChange) {
			this.setState({loading: true});
			this.props.onChange(file, () => {
				this.setState({loading: false});
			});
		}
	},

	_remove(filename, index) {
		if (this.props.onDelete) {
			this.props.onDelete(filename, index);
		}
	}

});

export default FileArrayInput;