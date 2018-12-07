import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

const DatasetPager = ({ pageInfo }) => (
  <div className="pager-wrapper">
    <ul className="pagination">
      <li>
        <a href="#">«</a>
      </li>
      <li>{pageInfo}</li>
      <li>
        <a href="#">»</a>
      </li>
    </ul>
  </div>
)

DatasetPager.propTypes = {
  count: PropTypes.int,
}

export default DatasetPager
