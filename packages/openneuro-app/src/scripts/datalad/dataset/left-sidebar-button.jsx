import React from 'react'
import PropTypes from 'prop-types'

const LeftSidebarButton = ({ toggle, sidebar }) => (
  <span className="show-nav-btn" onClick={toggle}>
    {sidebar ? (
      <i className="fa fa-angle-double-left" aria-hidden="true" />
    ) : (
      <i className="fa fa-angle-double-right" aria-hidden="true" />
    )}
  </span>
)

LeftSidebarButton.propTypes = {
  toggle: PropTypes.func,
  sidebar: PropTypes.bool,
}

export default LeftSidebarButton
