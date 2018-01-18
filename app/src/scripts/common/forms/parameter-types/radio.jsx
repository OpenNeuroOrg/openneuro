import React from 'react'
import Input from '../input.jsx'

export default ({ props, counter }) => {
  let options = []
  // let counter = 2;
  console.log(counter)
  for (let i = 0; i < counter; i++) {
    let num = i + 1
    let key = 'option ' + num
    let input = (
      <li key={key}>
        <Input
          type="text"
          name={key}
          placeholder={key}
          // onChange={this._handleArray.bind(this, field)}
          key={num}
        />
      </li>
    )
    options.push(input)
  }

  let addInput = () => {
    // Need to update counter w/out state. Trying to keep these stateless components. May need to feed this function as a prop and set the state higher up in the component tree. End of day.
    return counter + 1
  }

  return (
    <span>
      <button
        className="admin-button"
        // onClick={this._handleCheck.bind(this, type)}
        key="required">
        <i className="fa fa-square-o" />required
      </button>
      <br />
      {options}
      <br />
      <button className="cte-save-btn btn-admin-blue" onClick={addInput}>
        add another option <i className="fa fa-plus" aria-hidden="true" />
      </button>
    </span>
  )
}
