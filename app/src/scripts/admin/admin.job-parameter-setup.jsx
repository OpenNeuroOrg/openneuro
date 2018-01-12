import React from 'react'
import Select from 'react-select'
import PropTypes from 'prop-types'
import JobParameter, {
  PARAMETER_INPUTS,
} from '../common/forms/job-parameter.jsx'
import Spinner from '../common/partials/spinner.jsx'
import WarnButton from '../common/forms/warn-button.jsx'

/** 
 * Options for a single parameter 
 */
class JobParameterOptions extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      type: props.type ? props.type : 'text',
      label: props.label ? props.label : '',
      description: props.description ? props.description : '',
      defaultValue: props.defaultValue ? props.defaultValue : '',
      value: props.value ? props.value : '',
      required: props.required ? props.required : false,
      hidden: props.hidden ? props.hidden : false,
      defaultChecked: props.defaultChecked ? props.defaultChecked : [],
      option: props.option ? props.option : [],
    }
    console.log(this.state)
  }
  render() {
    // TODO - onChange here would replace the parameter with the updated one
    return (
      <ul>
        <li>
          <Select options={PARAMETER_INPUTS} value={this.state.type} />
        </li>
        <li>
          <input
            name="label"
            value={this.state.label}
            placeholder="Key"
            type="text"
          />
        </li>
        <li>
          here~
          <input
            name="description"
            value={this.state.description}
            placeholder="Parameter Description"
            type="text"
          />
        </li>
        <li>
          <JobParameter type={this.state.type} />
        </li>
        <li>
          <input name="required" value={this.state.required} type="checkbox" />
        </li>
        <li>
          <input name="hidden" value={this.state.hidden} type="checkbox" />
        </li>
      </ul>
    )
  }
}

/**
 * Define the parameters for a given job
 */
class JobParameterSetup extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      type: props.type ? props.type : '',
      label: props.label ? props.label : '',
      description: props.description ? props.description : '',
      defaultValue: props.defaultValue ? props.defaultValue : '',
      value: props.value ? props.value : '',
      required: props.required ? props.required : false,
      hidden: props.hidden ? props.hidden : false,
      defaultChecked: props.defaultChecked ? props.defaultChecked : [],
      option: props.option ? props.option : [],
    }
  }

  render() {
    let value = this.state.value
    console.log(this.state.type)
    return (
      <div className="job-parameters-setup">
        <Select options={PARAMETER_INPUTS} value={this.state.type} />
        <ul className="job-parameters-list">
          {this.props.parameters.map(param => {
            return (
              <li>
                <JobParameterOptions {...param} />
                <button
                  className="btn"
                  onClick={this._remove.bind(this, param.label)}>
                  Delete
                </button>
              </li>
            )
          })}
        </ul>
        <button className="btn" onClick={this._add.bind(this)}>
          Add
        </button>
      </div>
    )
  }
  // template methods -----------------------------------------------------------------------

  // custom methods -------------------------------------------------------------------------
  _add(e) {
    /* TODO - This would push a new parameter into the definition in the store */
    console.log(e)
  }

  _remove(e, target) {
    /* TODO - This would find the key and remove it */
    console.log(e, target)
  }

  _handleSelectChange(e, target) {
    console.log(e, target)
    // console.log()
    // this.setState({type: e.target.value})
  }

  // End of class
}

JobParameterSetup.propTypes = {
  parameters: PropTypes.array,
}

export default JobParameterSetup
