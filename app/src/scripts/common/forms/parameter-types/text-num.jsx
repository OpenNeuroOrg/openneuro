import React from 'react'
import Input from '../input.jsx'

export default ({ type, onCheck, onChange, model }) => {
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
      <Input
        type={type}
        name="defaultValue"
        value={model.defaultValue}
        placeholder="Default Value"
        onChange={onChange.bind(this, 'defaultValue')}
      />
    </span>
  )
}
