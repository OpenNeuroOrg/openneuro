// dependencies -----------------------------------------------------------------------

import React from 'react';

// component setup --------------------------------------------------------------------

export default class Sort extends React.Component {

// life cycle events ------------------------------------------------------------------

    render() {
        return (
            <div className="sort clearfix">
                <label>Sort by:</label>
                {this._options(this.props.options, this.props.sort)}
            </div>
        );
    }

// template methods -------------------------------------------------------------------

    _options(options, sort) {
        let icon = sort.direction == '+' ? <i className="fa fa-sort-asc"></i> : <i className="fa fa-sort-desc"></i>;
        return options.map((option) => {
            return (
                <a key={option.label}
                   className={option.value == option.label ? 'btn-sort name active' : 'btn-sort name'}
                   onClick={this._sort.bind(this, option.property, option.isTimestamp)}>
                    {option.label} {sort.value == option.property ? icon : null}
                </a>
            );
        });
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
        this.props.sortFunc(value, direction, null, isTimestamp);
    }
}

Sort.propTypes = {
    options:  React.PropTypes.array,
    sort:     React.PropTypes.object,
    sortFunc: React.PropTypes.func
};
