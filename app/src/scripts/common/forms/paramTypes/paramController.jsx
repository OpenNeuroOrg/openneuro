import React from 'react'
import PropTypes from 'prop-types'
import Input from '../input.jsx'

class ParamController extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return <div className="input-fields">{this._selectControl()}</div>
  }

  //  Template Methods ------------------------------------------------------------------------------

  _selectControl() {
    let inputFields = []
    let checked = this.props.checked
    let selected = this.props.selected

    this.props.model.map(field => {
      if (selected === 'file') {
        inputFields.push(this._returnFile(field))
      } else if (selected === 'text' || selected === 'numeric') {
        inputFields.push(this._returnTextOrNum(field))
      }
    })
    return <span>{inputFields}</span>
  }

  //  Custom Methods ------------------------------------------------------------------------------

  _handleChange(field, e) {
    let value = e.target.value
    let event = { target: { value: value } }
    this.props.onInput(field, event)
  }

  _handleCheck(field) {
    let checked = this.props.checked

    if (!checked.includes(field)) {
      this.props.checked.push(field)
    } else {
      checked.splice(field, 1)
    }

    this.props.onCheck(field)
  }

  // ParamTypes Methods ---------------------------------------------------------------------------

  _returnTextOrNum(field) {
    if (field.type === 'checkbox') {
      return (
        <button
          className="admin-button"
          onClick={this._handleCheck.bind(this, field.id)}
          key={field.id}>
          <i
            className={
              this.props.checked.includes(field.id)
                ? 'fa fa-check-square-o'
                : 'fa fa-square-o'
            }
          />{' '}
          {field.id}
        </button>
      )
    } else if (field.id != 'type') {
      return (
        <Input
          type={this.props.selected}
          name={field.id}
          placeholder={field.placeholder}
          onChange={this._handleChange.bind(this, field.id)}
          key={field.id}
        />
      )
    }
  }

  _returnFile(field) {
    if (field.id === 'defaultValue') {
      return (
        <Input
          type={this.props.selected}
          name={field.id}
          placeholder={field.placeholder}
          onChange={this._handleChange.bind(this, field.id)}
          key={field.id}
        />
      )
    } else if (field.type === 'checkbox' && field.id === 'required') {
      return (
        <button
          className="admin-button"
          onClick={this._handleCheck.bind(this, field.id)}
          key={field.id}>
          <i
            className={
              this.props.checked.includes(field.id)
                ? 'fa fa-check-square-o'
                : 'fa fa-square-o'
            }
          />{' '}
          {field.id}
        </button>
      )
    }
  }
}

ParamController.propTypes = {
  model: PropTypes.array.isRequired,
  selected: PropTypes.string,
  onInput: PropTypes.func,
  onCheck: PropTypes.func,
  checked: PropTypes.array,
}

export default ParamController
