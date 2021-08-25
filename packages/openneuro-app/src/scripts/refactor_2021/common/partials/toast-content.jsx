import React from 'react'
import PropTypes from 'prop-types'

const ToastContent = ({ title, body, children }) => (
  <span>
    <h3>{title}</h3>
    <h4>{body}</h4>
    {children}
  </span>
)

ToastContent.propTypes = {
  title: PropTypes.string,
  body: PropTypes.string,
  children: PropTypes.node,
}

export default ToastContent
