import React from 'react'

const LeftSidebarButton = ({ toggle, sidebar }) => (
  <span className="show-nav-btn" onClick={toggle}>
    {sidebar ? (
      <i className="fa fa-angle-double-left" aria-hidden="true" />
    ) : (
      <i className="fa fa-angle-double-right" aria-hidden="true" />
    )}
  </span>
)

export default LeftSidebarButton
