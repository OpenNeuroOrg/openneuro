import React from 'react'

let ArrayInput = React.createClass({


	render() {
		let items = this.props.value.map((item, index) => {
			return <div key={index}>{item} <button>x</button></div>
		});

		return (
			<div>
				<div>
					{items}
				</div>
				<input type="text" />
				<button>add</button>
			</div>
		)
	}
});

// ArrayInput.PropTypes = {
// 	value: React.PropTypes.array
// };

// ArrayInput.PropTypes = {
// 	value: []
// };

export default ArrayInput;