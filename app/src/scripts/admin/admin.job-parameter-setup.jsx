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
      checked: [],
      // options: {},
    }

    for (let field of this.props.model) {
      if (field.id === 'options' || field.id === 'defaultChecked') {
        initialState[field.id] = []
      } else {
        initialState[field.id] = ''
      }
    }

    this.initialState = initialState
    this.state = initialState
  }

  render() {
    let value = this.state.value
    return (
      <div className="job-parameters-setup">
        <Select
          options={PARAMETER_INPUTS}
          value={this.state.type}
          onChange={this._handleSelectChange.bind(this)}
        />
        {this.state.type != '' ? this._returnInput() : null}
        <button className="btn admin-btn" onClick={this._add.bind(this)}>
          Add
        </button>
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
          />

          <Input
            name="description"
            value={this.state.description}
            placeholder="Parameter Description"
            type="text"
          />

          <JobParameter selected={this.state.type} />
        </span>
      </div>
    )
  }

  // custom methods -------------------------------------------------------------------------
  _add(e) {
    /* TODO - This would push a new parameter into the definition in the store */
    console.log('POP!')
  }

  _remove(e, target) {
    /* TODO - This would find the key and remove it */
    console.log(e, target)
  }

  _onChange() {
    /* TODO - This will handle input changes */
  }

  _toggleCheck() {
    /* TODO - This will handle checkbox changes */
  }

  _handleSelectChange(e) {
    let value
    e === null ? (value = '') : (value = e.value)
    this.setState({ type: value })
  }

  // End of class
}

JobParameterSetup.propTypes = {
  model: PropTypes.array,
}

export default JobParameterSetup
