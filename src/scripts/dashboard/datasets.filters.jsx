// dependencies -----------------------------------------------------------------------

import React   from 'react';
import Actions from './datasets.actions.js';

// component setup --------------------------------------------------------------------

export default class Filters extends React.Component {

// life cycle events ------------------------------------------------------------------

	render() {

		let filters   = this.props.filters;

		let filterButtons;
		if (!this.props.isPublic) {
			filterButtons = (
				<div className="filters">
		            <span>Showing:</span>
		            <button className={filters.length === 0 ? 'active btn-filter' : 'btn-filter'} onClick={this._filter.bind(this, 'reset')}>All</button>
		            <button className={filters.indexOf('public') > -1 ? 'active btn-filter filter-public' : 'btn-filter filter-public'} onClick={this._filter.bind(this, 'public')}><i className="fa fa-globe"></i> <span className="filter-text">Public</span></button>
		            <button className={filters.indexOf('incomplete') > -1 ? 'active btn-filter filter-incomplete' : 'btn-filter filter-incomplete'} onClick={this._filter.bind(this, 'incomplete')}><i className="fa fa-warning"></i>  <span className="filter-text">Incomplete</span></button>
		            <button className={filters.indexOf('shared') > -1 ? 'active btn-filter filter-shared' : 'btn-filter filter-shared'} onClick={this._filter.bind(this, 'shared')}><i className="fa fa-user"></i>  <span className="filter-text">Shared with me</span></button>
		        </div>
		    );
		}
		return (
			<span>{filterButtons}</span>
		);
	}
	// custom methods ---------------------------------------------------------------------

    _filter(value) {
    	Actions.filter(value);
    }

};
