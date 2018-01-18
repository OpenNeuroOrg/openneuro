import React from 'react'

export default () => {
  return (
    <button
      className="admin-button"
      // onClick={this._handleCheck.bind(this, field.id)}
      key="required">
      <i className="fa fa-square-o" />
      // {
      //   this.props.checked.includes(field.id)
      //     ? 'fa fa-check-square-o'
      //     : 'fa fa-square-o'
      // }
      required
    </button>
  )
}
