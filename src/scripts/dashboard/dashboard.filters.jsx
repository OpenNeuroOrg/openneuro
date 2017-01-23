// dependencies -----------------------------------------------------------------------

import React   from 'react';
import Actions from './dashboard.datasets.actions.js';

// component setup --------------------------------------------------------------------

export default class Filters extends React.Component {

// life cycle events ------------------------------------------------------------------

    render() {

        let filters          = this.props.filters;
        let incompleteFilter = this._button('incomplete', 'fa-warning', 'Incomplete');
        let sharedFilter     = this._button('shared', 'fa-user', 'Shared with me');
        let invalidFilter    = this._button('invalid', 'fa-exclamation-circle', 'Invalid');
        let publicFilter     = this._button('public', 'fa-globe', 'Public');
        let filterButtons;
        if (!this.props.isPublic) {
            filterButtons = (
                <div className="filters">
                    <label>Filter By:</label>
                        <button className={filters.length === 0 ? 'active btn-filter filter-all' : 'btn-filter filter-all'}
                                onClick={this._filter.bind(this, 'reset')}>All</button>
                    {incompleteFilter}
                    {sharedFilter}
                    {invalidFilter}
                    {publicFilter}
                </div>
            );
        }
        return (
            <span>{filterButtons}</span>
        );
    }

    // custom methods ---------------------------------------------------------------------

    /**
     * Takes a filter name, an icon class,
     and returns the markup
     * for a filter button.
     */
    _button(filter, icon, label) {
        let filters  = this.props.filters;
        return (
            <button className={filters.indexOf(filter) > -1 ? 'active btn-filter filter-' + filter : 'btn-filter filter-' + filter} onClick={this._filter.bind(this, filter)}>
                <i className={'fa ' + icon}></i>
                <span className="filter-text">{label}</span>
            </button>
        );
    }

    _filter(value) {
        Actions.filter(value);
    }

}

Filters.propTypes = {
    filters: React.PropTypes.array,
    isPublic: React.PropTypes.bool
};
