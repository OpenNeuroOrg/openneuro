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

    // console.log(inputFields)
    this.props.model.map(field => {
      if (selected === 'file') {
        inputFields.push(this._returnFile(field))
      } else if (selected === 'text' || selected === 'numeric') {
        inputFields.push(this._returnTextOrNum(field))
      } else if (selected === 'radio') {
        inputFields.push(this._returnRadio(field))
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

  // _handleOptions(field, option) {
  //   field.options.push(option)
  // }

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
    } else if (field.id != 'type' && field.id != 'options') {
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
    if (field.id === 'description' || field.id === 'label') {
      return (
        <Input
          type="text"
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

  _returnRadio(field) {
    if (field.type === 'checkbox' && field.id === 'required') {
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
    } else if (field.hasOwnProperty('placeholder') && field.id != 'type') {
      return (
        <Input
          type="text"
          name={field.id}
          placeholder={field.placeholder}
          onChange={this._handleChange.bind(this, field.id)}
          key={field.id}
        />
      )
    } else if (field.id === 'options') {
      for (let i = 0; i < field.radio; i++) {
        let num = i + 1
        let key = field.id + ' ' + num
        let input = (
          <li key={key}>
            <Input
              type="text"
              name={key}
              placeholder={key}
              onChange={this._handleChange.bind(this, key)}
              key={key}
            />
          </li>
        )

        field.options.push(input)
      }
      return field.options
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
