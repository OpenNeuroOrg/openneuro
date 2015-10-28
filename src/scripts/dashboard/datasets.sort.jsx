// dependencies -----------------------------------------------------------------------

import React   from 'react';
import Actions from './datasets.actions.js';

// component setup --------------------------------------------------------------------

export default class Sort extends React.Component {

// life cycle events ------------------------------------------------------------------

	render() {
		let direction = this.props.sort.direction;
		let value     = this.props.sort.value;
		let icon = direction == '+' ? <i className="fa fa-sort-asc"></i> : <i className="fa fa-sort-desc"></i>;
		return (
				<div className="sort clearfix">
		            <button className="btn-sort name" onClick={this._sort.bind(this, 'name')}>Name {value == 'name' ? icon : null}</button>
		            <button className="btn-sort date" onClick={this._sort.bind(this, 'timestamp')}>Date {value == 'timestamp' ? icon : null}</button>
		        </div>
		);
	}

// custom methods ---------------------------------------------------------------------

    _sort(value) {
    	let direction;

    	if (value == this.props.sort.value) {
    		direction = this.props.sort.direction == '+' ? '-' : '+';
    	} else {
    		direction = '+';
    	}
        Actions.sort(value, direction);
    }
};
