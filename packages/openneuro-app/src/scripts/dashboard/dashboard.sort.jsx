// dependencies -----------------------------------------------------------------------

import React from 'react'
import PropTypes from 'prop-types'

// component setup --------------------------------------------------------------------

export default class Sort extends React.Component {
  // life cycle events ------------------------------------------------------------------

  render() {
    return (
      <div className="sort clearfix">
        <label>Sort by:</label>
        {this._options(this.props.options, this.props.sort)}
      </div>
    )
  }

  // template methods -------------------------------------------------------------------

  _options(options, sort) {
    let icon =
      sort.direction == '+' ? (
        <i className="fa fa-sort-asc" />
      ) : (
        <i className="fa fa-sort-desc" />
      )
    return options.map(option => {
      return (
        <a
          key={option.label}
          className={
            option.value == option.label
              ? 'btn-sort name active'
              : 'btn-sort name'
          }
          onClick={this._sort.bind(
            this,
            option.property,
            option.type,
            option.initSortOrder,
          )}>
          {option.label} {sort.value == option.property ? icon : null}
        </a>
      )
    })
  }

  // custom methods ---------------------------------------------------------------------

  _sort(value, type, initSortOrder) {
    let direction

    if (value == this.props.sort.value) {
      direction = this.props.sort.direction == '+' ? '-' : '+'
    } else {
      direction = initSortOrder
    }
    this.props.sortFunc(value, direction, null, type)
  }
}

Sort.propTypes = {
  options: PropTypes.array,
  sort: PropTypes.object,
  sortFunc: PropTypes.func,
}
