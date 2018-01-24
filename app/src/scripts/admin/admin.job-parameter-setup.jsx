import React from 'react'
import Select from 'react-select'
import PropTypes from 'prop-types'
import JobParameter, {
  PARAMETER_INPUTS,
} from '../common/forms/job-parameter.jsx'
import Spinner from '../common/partials/spinner.jsx'
import WarnButton from '../common/forms/warn-button.jsx'
import Input from '../common/forms/input.jsx'

/**
 * Define the parameters for a given job
 */
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

  // Must set up error handling and edit/remove

  render() {
    return (
      <div className="job-parameters-setup">
        <Select
          options={PARAMETER_INPUTS}
          value={this.state.type}
          onChange={this._handleSelectChange.bind(this)}
        />
        {this.state.type != '' ? this._returnInput() : null}
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
            />required
          </button>

          <JobParameter
            selected={this.state.type}
            onCheck={this._toggleCheckBox}
            checked={this.state.checked}
            onArray={this._onArray.bind(this)}
            defChecked={this.state.defaultChecked}
          />
          <br />
          <button
            className="cte-save-btn btn-admin-blue add-btn"
            onClick={this._add.bind(this)}>
            Add
          </button>
        </span>
      </div>
    )
  }

  // custom methods -------------------------------------------------------------------------
  _add(e) {
    /* TODO - This would push a new parameter into the definition in the store */
    // this is currently disabled.
    console.log(this.state)
  }

  // _remove(e, target) {
  //   /* TODO - This would find the key and remove it */
  // Needs to set up rendering of edit...
  //   console.log(e, target)
  // }

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
    let value
    e === null ? (value = '') : (value = e.value)
    this.setState({ type: value })
  }

  // Needs to handle delete don't forget
  _onArray(key, event) {
    let opts = this.state.options
    opts[key] = event.target.value
  }
  // End of class
}

JobParameterSetup.propTypes = {
  model: PropTypes.array,
}

export default JobParameterSetup
