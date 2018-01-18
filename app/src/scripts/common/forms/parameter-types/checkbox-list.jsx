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

  render() {
    let options = []
    return (
      <span>
        <button
          className="admin-button"
          // onClick={this._handleCheck.bind(this, type)}
          key="required">
          <i className="fa fa-square-o" />required
        </button>
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
          // onClick={this._handleCheck.bind(this, key)}
          key={num}>
          <i className="fa fa-square-o" />{' '}
          // {
          //   this.props.defChecked.includes(key)
          //     ? 'fa fa-check-square-o'
          //     : 'fa fa-square-o'
          // }
          default checked
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
          <button
            className="admin-button"
            onClick={this._deleteInput.bind(this)}>
            <i className="fa fa-trash-o" />{' '}
            // {
            //   this.props.defChecked.includes(key)
            //     ? 'fa fa-check-square-o'
            //     : 'fa fa-square-o'
            // }
            delete
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
}
