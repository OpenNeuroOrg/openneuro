import React from 'react'
import PropTypes from 'prop-types'
import './button.scss'

/**
 * Primary UI component for user interaction
 */
export const Button = ({
  primary,
  backgroundColor,
  color,
  size,
  label,
  ...props
}) => {
  const mode = primary
    ? 'storybook-button--primary'
    : 'storybook-button--secondary'
  return (
    <button
      type="button"
      className={['storybook-button', `storybook-button--${size}`, mode].join(
        ' ',
      )}
      style={{
        backgroundColor: backgroundColor,
        color: color,
      }}
      {...props}>
      {label}
    </button>
  )
}

Button.propTypes = {
  primary: PropTypes.bool,
  backgroundColor: PropTypes.string,
  color: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func,
}

Button.defaultProps = {
  backgroundColor: null,
  color: null,
  primary: false,
  size: 'medium',
  onClick: undefined,
}
