// dependencies -----------------------------------------------------------------------

import React   from 'react';
import Actions from './dashboard.jobs.actions.js';

// component setup --------------------------------------------------------------------

export default class Sort extends React.Component {

// life cycle events ------------------------------------------------------------------

    render() {
        let direction = this.props.sort.direction;
        let value     = this.props.sort.value;
        let icon = direction == '+' ? <i className="fa fa-sort-asc"></i> : <i className="fa fa-sort-desc"></i>;
        return (
            <div className="sort clearfix">
                <label>Sort by:</label>
                <a className={value == 'datasetLabel' ? 'btn-sort name active' : 'btn-sort name'} onClick={this._sort.bind(this, 'datasetLabel')}>Name {value == 'datasetLabel' ? icon : null}</a>
                <a className={value == 'agave.created' ? 'btn-sort date active' : 'btn-sort date'} onClick={this._sort.bind(this, 'agave.created', true)}>Date {value == 'agave.created' ? icon : null}</a>
            </div>
        );
    }

// custom methods ---------------------------------------------------------------------

    _sort(value, isTimestamp) {
        let direction;
        isTimestamp = typeof isTimestamp === 'boolean' && isTimestamp;

        if (value == this.props.sort.value) {
            direction = this.props.sort.direction == '+' ? '-' : '+';
        } else {
            direction = '+';
        }
        Actions.sort(value, direction, null, isTimestamp);
    }
}

Sort.propTypes = {
    sort: React.PropTypes.object
};
