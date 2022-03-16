import React from 'react'
import PropTypes from 'prop-types'

const StyleButton = ({ style, label, active, onToggle }) => {
  return (
    <span
      className={
        active
          ? 'RichEditor-styleButton RichEditor-activeButton'
          : 'RichEditor-styleButton'
      }
      onMouseDown={e => {
        e.preventDefault()
        onToggle(style)
      }}>
      {label}
    </span>
  )
}

StyleButton.propTypes = {
  style: PropTypes.string,
  onToggle: PropTypes.func,
  active: PropTypes.bool,
  label: PropTypes.string,
}

export default StyleButton
