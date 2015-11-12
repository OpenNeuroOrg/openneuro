// dependencies -----------------------------------------------------------------------

import React   from 'react';
import Actions from './datasets.actions.js';
import Tooltip from '../common/partials/tooltip.jsx';

// component setup --------------------------------------------------------------------

export default class Filters extends React.Component {

// life cycle events ------------------------------------------------------------------

	render() {

		let filters  = this.props.filters;
		let publicFilter = this._button('public', 'fa-globe', 'Public datasets');
		let incompleteFilter = this._button('incomplete', 'fa-warning', 'Incomplete datasets');
		let sharedFilter = this._button('shared', 'fa-user', 'Datasets shared with me');

		let filterButtons;
		if (!this.props.isPublic) {
			filterButtons = (
				<div className="filters">
		            <label>Filter By:</label>
		            <Tooltip tooltip="All datasets"><button className={filters.length === 0 ? 'active btn-filter filter-all' : 'btn-filter filter-all'} onClick={this._filter.bind(this, 'reset')}>All</button></Tooltip>
		            {publicFilter}
		            {incompleteFilter}
		            {sharedFilter}
		        </div>
		    );
		}
		return (
			<span>{filterButtons}</span>
		);
	}

	// custom methods ---------------------------------------------------------------------

	/**
	 * Takes a filter name, an icon class, and
	 * a tooltip message and returns the markup
	 * for a filter button.
	 */
	_button(filter, icon, tip) {
		let filters  = this.props.filters;
		return (
			<Tooltip tooltip={tip}>
				<button className={filters.indexOf(filter) > -1 ? 'active btn-filter filter-' + filter : 'btn-filter filter-' + filter} onClick={this._filter.bind(this, filter)}>
					<i className={'fa ' + icon}></i>
					<span className="filter-text">{filter}</span>
				</button>
			</Tooltip>
		);
	}

    _filter(value) {
    	Actions.filter(value);
    }

};
