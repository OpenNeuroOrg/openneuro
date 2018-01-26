// dependencies -------------------------------------------------------

import React from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'
import Input from './input.jsx'
import WarnButton from './warn-button.jsx'
import ParamController from './paramTypes/paramController.jsx'

// component setup ----------------------------------------------------

class ArrayInput extends React.Component {
  // life cycle events --------------------------------------------------
  constructor(props) {
    super(props)
    const initialState = {
      error: null,
      helper: null,
      type: null,
      checked: [],
      // defChecked: [],
      options: {},
    }

    for (let field of this.props.model) {
      if (field.id === 'option' || field.id === 'defaultChecked') {
        initialState[field.id] = []
      } else {
        initialState[field.id] = ''
      }
    }

    this.initialState = initialState
    this.state = initialState
  }

  render() {
    let inputFields = null
    if (this.props.model) {
      inputFields = this.props.model.map(field => {
        if (field.hasOwnProperty('select') && field.select.length > 0) {
          return (
            <Select
              placeholder={field.placeholder}
              simpleValue
              options={field.select}
              value={this.state[field.id]}
              onChange={this._handleSelectChange.bind(this, field.id)}
              key={field.id}
            />
          )
        }
      })
    }

    return (
      <div className="cte-edit-array">
        {this._arrayList(this.props.value, this.props.model)}
        <div className="text-danger">{this.state.error}</div>
        <div className="text-info">{this.state.helper}</div>
        <div className="form-inline">
          <span>{inputFields}</span>
          <ParamController
            model={this.props.model}
            selected={this.state.type}
            onCheck={this._toggleCheckBox.bind(this)}
            onInput={this._handleChange.bind(this)}
            onArray={this._handleArray.bind(this)}
            checked={this.state.checked}
            defChecked={this.state.defaultChecked}
          />
          <br />
          <button
            className="cte-save-btn btn-admin-blue add-btn"
            onClick={this._add.bind(this, this.props.model)}>
            add
          </button>
        </div>
      </div>
    )
  }

  // template methods ---------------------------------------------------

  _arrayList(array, model) {
    // console.log(array)
    if (array && array.length > 0) {
      let list = array.map((item, index) => {
        // console.log(item)
        return (
          <ArrayItem
            key={index}
            index={index}
            item={item}
            model={model}
            onEdit={this._edit.bind(this)}
            remove={this._remove.bind(this, index)}
          />
        )
      })
      return <div className="cte-array-items">{list}</div>
    }
  }

  // custom methods -----------------------------------------------------

  _handleChange(key, event) {
    let state = {}
    state[key] = event.target.value
    this.setState(state)
  }

  _handleArray(key, field, event) {
    let opts = this.state.options
    opts[key] = event.target.value
  }

  _handleSelectChange(key, selected) {
    this.setState({ type: selected, options: [] })
    let state = {}
    state[key] = selected
    this.setState(state)
  }

  _toggleCheckBox(key) {
    let state = {}
    state[key] = !this.state[key]
    this.setState(state)
  }

  _add(model) {
    let value = this.props.value

    for (let field of model) {
      if (field.required && !this.state[field.id]) {
        this.setState({ error: field.placeholder + ' is required.' })
        return
      }
    }

    if (model.length > 1) {
      let itemValue = {}
      for (let field of model) {
        if (field.id === 'option') {
          itemValue[field.id] = this.state.options
        } else if (field.id === 'defaultChecked') {
          let options = this.state.options
          let defArr = []
          for (let op of this.state.defaultChecked) {
            if (options[op]) {
              defArr.push(options[op])
            }
          }
          itemValue[field.id] = defArr
        } else {
          itemValue[field.id] = this.state[field.id]
        }
      }
      value.push(itemValue)
    } else {
      value.push(this.state[model[0].id])
    }
    this.props.onChange({ target: { value: value } })
    //need to clear form on parameter add
    const initialState = { error: null }
    for (let field of this.props.model) {
      initialState[field.id] = ''
    }

    this.setState(initialState)
  }

  _remove(index, callback) {
    let array = this.props.value
    array.splice(index, 1)
    this.props.onChange({ target: { value: array } })
    callback()
  }

  _edit(index, value) {
    let item = this.props.value
    item[index] = value
    this.props.onChange({ target: { value: item } })
  }

  _hidden(key) {
    let state = {}
    state[key] = !this.state[key]
    this.setState(state)
  }
}

ArrayInput.defaultProps = {
  value: [],
}

ArrayInput.propTypes = {
  model: PropTypes.array,
  value: PropTypes.array,
  onChange: PropTypes.func,
}

export default ArrayInput

/**
 * ArrayItem
 *
 * Sub component of Array List Input used to manage
 * interactions on individual Array Items.
 */
class ArrayItem extends React.Component {
  constructor(props) {
    super(props)
    let initialState = {
      edit: false,
      error: null,
      checked: [],
      options: {},
    }

    for (let field of this.props.model) {
      initialState[field.id] = this.props.item[field.id]
    }

    this.state = initialState
  }

  componentWillReceiveProps() {
    this.setState({ edit: false })
  }

  render() {
    let view = (
      <div className="cte-array-item">
        {this._display()}
        <div className="btn-wrap">
          <WarnButton
            message="Remove"
            icon="fa-times"
            action={this.props.remove}
          />
        </div>
        <div className="btn-wrap">
          <WarnButton
            message="Edit"
            warn={false}
            icon="fa-pencil"
            action={this._toggleEdit.bind(this)}
          />
        </div>
      </div>
    )

    let edit = (
      <div className="cte-array-item">
        <div className="text-danger">{this.state.error}</div>
        <div className="form-inline">
          {this._input()}
          <div className="btn-wrap array-edit">
            <button
              className="btn-warn-component warning"
              onClick={this._save.bind(this, this.props.model)}>
              <i className="fa fa-check" /> Save
            </button>
          </div>
          <div className="btn-wrap array-edit">
            <WarnButton
              message="Cancel"
              warn={false}
              icon="fa-times"
              action={this._cancel.bind(this)}
            />
          </div>
        </div>
      </div>
    )

    return this.state.edit ? edit : view
  }

  // template methods ---------------------------------------------------

  _display() {
    let item = this.props.item
    // console.log(this.props.model)
    if (typeof item == 'object') {
      return (
        <span>
          {Object.keys(item).map(key => {
            return (
              <span className="reference-name" key={key}>
                {item[key]}
              </span>
            )
          })}
        </span>
      )
    } else {
      return <span className="reference-name">{item}</span>
    }
  }

  _input() {
    let inputFields = null
    if (this.props.model) {
      inputFields = this.props.model.map(field => {
        if (field.hasOwnProperty('select') && field.select.length > 0) {
          return (
            <Select
              placeholder={field.placeholder}
              simpleValue
              options={field.select}
              value={this.state[field.id]}
              onChange={this._handleSelectChange.bind(this, field.id)}
              key={field.id}
            />
          )
        }
      })
    }

    return (
      <div className="cte-edit-array">
        <span>{inputFields}</span>
        <ParamController
          model={this.props.model}
          selected={this.state.type}
          onCheck={this._toggleCheckBox.bind(this)}
          onInput={this._handleChange.bind(this)}
          onArray={this._handleArray.bind(this)}
          checked={this.state.checked}
          defChecked={this.state.defaultChecked}
        />
      </div>
    )
  }

  // custom methods -----------------------------------------------------

  _cancel() {
    this._toggleEdit()
    this.setState(this.initialState)
  }

  _toggleEdit() {
    this.setState({ edit: !this.state.edit })
  }

  _handleChange(key, event) {
    let state = {}
    state[key] = event.target.value
    this.setState(state)
  }

  _handleArray(key, field, event) {
    let opts = this.state.options
    opts[key] = event.target.value
  }

  _handleSelectChange(key, selected) {
    let state = {}
    state[key] = selected
    this.setState(state)
  }

  _toggleCheckBox(key) {
    let state = {}
    state[key] = !this.state[key]
    this.setState(state)
  }

  _save(model) {
    let data = {}
    for (let field of model) {
      data[field.id] = this.state[field.id]
    }
    this.props.onEdit(this.props.index, data)
  }
}

ArrayItem.propTypes = {
  model: PropTypes.array,
  item: props => {
    if (props.model.length > 1 && typeof props.item !== 'object') {
      return new Error(
        'Prop `item` must be an object if a model has more than one property',
      )
    }
    if (props.model.length == 1 && typeof props.item !== 'string') {
      return new Error(
        'Prop `item` must be a string if modal has a single property',
      )
    }
  },
  remove: PropTypes.func,
  onEdit: PropTypes.func,
  index: PropTypes.number,
}
