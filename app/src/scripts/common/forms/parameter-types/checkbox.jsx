import React from 'react'

export default ({ onCheck, onChange, model }) => {
  return (
    <span>
      <button
        className="admin-button"
        id="hidden-btn"
        onClick={onCheck.bind(this, 'hidden')}>
        <i
          className={
            model.hidden === true ? 'fa fa-check-square-o' : 'fa fa-square-o'
          }
        />{' '}
        hidden
      </button>
      <br />
      <label>
        <input
          type="checkbox"
          value={model.defaultValue}
          onChange={onChange.bind(this, 'defaultValue')}
        />Default Value
      </label>
    </span>
  )
}
