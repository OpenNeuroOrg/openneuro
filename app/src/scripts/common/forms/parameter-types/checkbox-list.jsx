import React from 'react'
import Input from '../input.jsx'
import PropTypes from 'prop-types'

class CheckboxOrListParameter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      counter: 1,
    }
  }

  // still need to implement logic for onclick check, deal with issue of uncontrolled to controlled

  render() {
    let options = []

    return (
      <span>
        <br />
        {this._returnInputs(options)}
        <br />
        <button
          className="cte-save-btn btn-admin-blue"
          onClick={this._addInput.bind(this, this.state)}>
          add another option <i className="fa fa-plus" aria-hidden="true" />
        </button>
      </span>
    )
  }

  //  Custom Methods -------------------------------------------------------------
  _deleteInput() {
    let counter = this.state.counter
    let newState = counter - 1
    this.setState({ counter: newState })
  }

  _addInput() {
    let counter = this.state.counter
    let newState = counter + 1
    this.setState({ counter: newState })
  }

  //  still needs to be full configured
  _handleCheck(key) {
    // let checked
    // //  checked = this.props.defChecked
    // if (!checked.includes(key)) {
    //   checked.push(key)
    // } else {
    //   checked.splice(key, 1)
    // }
    // this.props.onCheck(key)
  }

  // Template Methods -------------------------------------------------------------
  _returnInputs(options) {
    let counter = this.state.counter
    let type = this.props.type

    for (let i = 0; i < counter; i++) {
      let num = i + 1
      let key = 'option ' + num
      let button = (
        <button
          className="admin-button"
          // onClick={this.props.onCheck.bind(this, key)}
          key={num}>
          <i className="fa fa-square-o" /> default checked
        </button>
      )

      let input = (
        <li key={key}>
          <Input
            type="text"
            name={key}
            placeholder={key}
            // onChange={this._handleArray.bind(this, field)}
            key={key}
          />
          {type === 'checkbox' ? button : null}
          <button className="admin-button">
            {/* // onClick={this._deleteInput.bind(this)} */}
            <i className="fa fa-trash-o" /> delete
          </button>
        </li>
      )
      options.push(input)
    }

    return <span>{options}</span>
  }
}

export default CheckboxOrListParameter

CheckboxOrListParameter.propTypes = {
  type: PropTypes.string,
  onCheck: PropTypes.func,
  checked: PropTypes.array,
}
