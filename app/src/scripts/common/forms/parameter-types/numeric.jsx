import React from 'react'
import Input from '../input.jsx'

export default ({ props }) => {
  let types = ['hidden', 'required']
  let checkboxes = []

  for (let type of types) {
    checkboxes.push(
      <button
        className="admin-button"
        // onClick={this._handleCheck.bind(this, type)}
        key={type}>
        <i className="fa fa-square-o" />
        {type}
      </button>,
    )
  }

  return (
    <span>
      <Input
        type="number"
        name="defaultValue"
        // value={this.props.defaultValue}
        placeholder="Default Value"
        // onChange=
      />
      {checkboxes}
    </span>
  )
}
