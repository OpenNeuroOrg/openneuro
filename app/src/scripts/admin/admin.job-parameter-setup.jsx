import React from 'react'
import Select from 'react-select'
import PropTypes from 'prop-types'
import JobParameter, {
  PARAMETER_INPUTS,
} from '../common/forms/job-parameter.jsx'
import Input from '../common/forms/input.jsx'

// Sub-component ----------------------------------------
import JobParameterEdit from './admin.job-parameter-edit.jsx'
// ------------------------------------------------------

class JobParameterSetup extends React.Component {
  constructor(props) {
    super(props)
    const initialState = {
      error: null,
      helper: null,
    }

    for (let field of this.props.model) {
      if (field.id === 'options' || field.id === 'defaultChecked') {
        initialState[field.id] = []
      } else if (field.id === 'hidden' || field.id === 'required') {
        initialState[field.id] = false
      } else {
        initialState[field.id] = ''
      }
    }

    this.initialState = initialState
    this.state = initialState
  }

  // Must set up edit

  render() {
    return (
      <div className="cte-edit-array">
        {this._arrayList(this.props.value, this.props.model)}
        {this.state.error != '' ? this._returnError() : null}
        <div className="job-parameters-setup">
          <Select
            options={PARAMETER_INPUTS}
            value={this.state.type}
            onChange={this._handleSelectChange.bind(this)}
          />
          {this.state.type != '' ? this._returnInput() : null}
        </div>
      </div>
    )
  }

  // template methods -----------------------------------------------------------------------

  _returnInput() {
    return (
      <div className="form-inline">
        <span>
          <Input
            name="label"
            value={this.state.label}
            placeholder="Key"
            type="text"
            onChange={this._onChange.bind(this, 'label')}
          />

          <Input
            name="description"
            value={this.state.description}
            placeholder="Parameter Description"
            type="text"
            onChange={this._onChange.bind(this, 'description')}
          />

          <button
            className="admin-button"
            onClick={this._toggleCheckBox.bind(this, 'required')}
            key="required">
            <i
              className={
                this.state.required === true
                  ? 'fa fa-check-square-o'
                  : 'fa fa-square-o'
              }
            />{' '}
            required
          </button>

          <JobParameter
            selected={this.state.type}
            onCheck={this._toggleCheckBox.bind(this)}
            onChange={this._onChange.bind(this)}
            model={this.state}
          />
          <br />
          <button
            className="cte-save-btn btn-admin-blue add-btn"
            onClick={this._add.bind(this, this.props.model)}>
            Add
          </button>
        </span>
      </div>
    )
  }

  _arrayList(array, model) {
    if (array && array.length > 0) {
      let list = array.map((item, index) => {
        return (
          <JobParameterEdit
            key={index}
            index={index}
            item={item}
            model={model}
            onEdit={this._edit.bind(this)}
            remove={this._remove.bind(this, index)}
            returnInput={this._returnInput.bind(this)}
          />
        )
      })
      return <div className="cte-array-items">{list}</div>
    }
  }

  _returnError() {
    return <div className="text-danger">{this.state.error}</div>
  }

  // custom methods -------------------------------------------------------------------------
  _add(model) {
    let value = this.props.value
    // error for checkboxes
    if (this.state.required && this.state.hidden) {
      this.setState({ error: 'Please select either hidden or required.' })
      return
    }
    // cannot add participant_label
    if (this.state.label === 'participant_label') {
      this.setState({
        error:
          'Participant label will be added automatically. Please do not add it as a parameter. ',
      })
      return
    }

    // error for hidden params w/out defvalue
    if (this.state.hidden && this.state.defaultValue === '') {
      this.setState({ error: 'Hidden parameters require a default value.' })
      return
    }
    // error for missing label
    for (let field of model) {
      if (field.required && !this.state[field.id]) {
        this.setState({ error: field.placeholder + ' is required.' })
        return
      }
    }

    if (model.length > 1) {
      let itemValue = {}
      for (let field of model) {
        itemValue[field.id] = this.state[field.id]
      }
      value.push(itemValue)
    } else {
      value.push(this.state[model[0].id])
    }
    this.props.onChange({ target: { value: value } })

    // clear the state on add
    for (let field of this.props.model) {
      if (field.id === 'options' || field.id === 'defaultChecked') {
        this.initialState[field.id] = []
      } else if (field.id === 'hidden' || field.id === 'required') {
        this.initialState[field.id] = false
      } else {
        this.initialState[field.id] = ''
      }
    }
    this.setState(this.initialState)
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

  _onChange(key, e) {
    let value = e.target.value
    let state = {}
    state[key] = value
    this.setState(state)
  }

  _toggleCheckBox(key) {
    let state = {}
    state[key] = !this.state[key]
    this.setState(state)
  }

  _handleSelectChange(e) {
    this.setState(this.initialState)
    let value
    e === null ? (value = '') : (value = e.value)
    this.setState({ type: value })
    value === 'checkbox' ? this.setState({ defaultValue: false }) : null
  }

  // End of class
}

JobParameterSetup.propTypes = {
  model: PropTypes.array,
  value: PropTypes.array,
  onChange: PropTypes.func,
}

export default JobParameterSetup
