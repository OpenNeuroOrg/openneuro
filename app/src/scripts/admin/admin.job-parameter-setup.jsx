import React from 'react'
import Select from 'react-select'
import JobParameter, {
  PARAMETER_INPUTS,
} from '../common/forms/job-parameter.jsx'

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
      value: props.value ? props.value : '',
      required: props.required ? props.required : false,
      hidden: props.hidden ? props.hidden : false,
    }
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
  render() {
    return (
      <div className="job-parameters-setup">
        <ul className="job-parameters-list">
          {this.props.parameters.map(param => {
            return (
              <li>
                <JobParameterOptions {...param} />
                <button
                  className="btn"
                  onClick={this.remove.bind(this, param.label)}>
                  Delete
                </button>
              </li>
            )
          })}
        </ul>
        <button className="btn" onClick={this.add.bind(this)}>
          Add
        </button>
      </div>
    )
  }

  add(e) {
    /* TODO - This would push a new parameter into the definition in the store */
    console.log(e)
  }

  remove(e, target) {
    /* TODO - This would find the key and remove it */
    console.log(e, target)
  }
}

export default JobParameterSetup
