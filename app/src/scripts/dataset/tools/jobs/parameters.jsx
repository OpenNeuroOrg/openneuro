import React from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'

const JobParameters = ({
  parameters,
  subjects,
  onChange,
  onRestoreDefaults,
  parametersMetadata,
}) => {
  if (Object.keys(parameters).length === 0) {
    return <noscript />
  }
  // console.log(parameters)
  const parameterInputs = Object.keys(parameters).map(parameter => {
    let input
    let isCheckbox = parametersMetadata[parameter].type === 'checkbox'
    let isMulti = parametersMetadata[parameter].type === 'multi'
    let isSelect = parametersMetadata[parameter].type === 'select'
    let isRadio = parametersMetadata[parameter].type === 'radio'
    let isFile = parametersMetadata[parameter].type === 'file'
    let isDefaultChecked = parametersMetadata[parameter].defaultValue === 'true'
    let helpText = parametersMetadata[parameter]
      ? parametersMetadata[parameter].description
      : parameter

    if (isSelect) {
      let placeholder = 'Select your ' + parametersMetadata[parameter].label
      let options = []
      let params = parametersMetadata[parameter].defaultValue
      Object.values(params).map(ops => {
        for (let i = 0; i <= ops.length; ++i) {
          options[i] = { value: i, label: ops[i] }
        }
      })

      if (parameter.indexOf('participant_label') > -1) {
        let onSelectChange = value => {
          // Extract list from Select's simpleValue
          let selected = value.split(',')
          let event = { target: { value: selected } }
          console.log(event)
          return onChange(parameter, event)
        }
        // Adapt the Select's onChange call to match the expected input event
        input = (
          <Select
            multi
            simpleValue
            value={parameters[parameter]}
            placeholder="Select your subject(s)"
            options={subjects}
            onChange={onSelectChange}
          />
        )
      } else {
        let onSelectChange = value => {
          let event = { target: { value: value } }
          return onChange(parameter, event)
        }

        input = (
          <Select
            simpleValue
            value={parameters[parameter]}
            placeholder={placeholder}
            options={options}
            onChange={onSelectChange}
          />
        )
      } // end of select conditionals //
    } else if (isFile) {
      input = (
        <input
          className="form-control"
          type="file"
          name={parameter}
          onChange={onChange.bind(null, parameter)}
        />
      )
    } else if (isCheckbox) {
      let onCheckChange = e => {
        // using checked property for checkbox values
        let event = { target: { value: e.target.checked } }
        return onChange(parameter, event)
      }
      // ** Check for default checked ** //
      if (isDefaultChecked) {
        input = (
          <label className="help-text">
            <input
              className="form-control"
              type="checkbox"
              name={parameter}
              onChange={onCheckChange}
              defaultChecked
            />
            {helpText}
          </label>
        )
      } else {
        input = (
          <label className="help-text">
            <input
              className="form-control"
              type="checkbox"
              name={parameter}
              onChange={onCheckChange}
            />
            {helpText}
          </label>
        )
      }
    } else if (isRadio) {
      input = (
        <input
          type="radio"
          className="form-control"
          value={parameters[parameter]}
          onChange={onChange.bind(null, parameter)}
        />
      )
    } else if (isMulti) {
      let onCheckChange = e => {
        // using checked property for checkbox values
        let event = { target: { value: e.target.checked } }
        return onChange(parameter, event)
      }

      let inputArr = []
      let params = parametersMetadata[parameter].defaultValue
      Object.values(params).map(ops => {
        for (let i = 0; i < ops.length; ++i) {
          let name = ops[i]
          let html = (
            <div className="checkbox multi-check">
              <input
                type="checkbox"
                className="form-control"
                value={parameters[parameter]}
                name={name}
                onChange={onChange.bind(null, parameter)}
              />
              <span>{name}</span>
            </div>
          )
          inputArr.push(html)
        }
      })

      // ** render the array w/in input **//
      input = <label className="multi-container">{inputArr}</label>
    } else {
      input = (
        <input
          className="form-control"
          value={parameters[parameter]}
          onChange={onChange.bind(null, parameter)}
        />
      )
    }
    let help_text
    if (isCheckbox) {
      // The label has the help text.
      help_text = ''
    } else {
      help_text = (
        <span className="help-text">
          {parametersMetadata[parameter]
            ? parametersMetadata[parameter].description
            : parameter}
        </span>
      )
    }
    return (
      <div
        className={
          parametersMetadata[parameter] &&
          parametersMetadata[parameter].required
            ? 'required-param'
            : null
        }
        id={parametersMetadata[parameter].hidden ? 'hidden' : null}
        key={parameter}>
        <div className="parameters form-horizontal">
          <div className="form-group" key={parameter}>
            <label className="sr-only">{parameter}</label>
            <div className="input-group">
              <div className="input-group-addon">{parameter}</div>
              <div className="clearfix">
                {input}
                {help_text}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  })

  return (
    <div>
      <br />
      <hr />
      <br />
      <div className="row">
        <div className="col-xs-6">
          <h5>Parameters</h5>
        </div>
        <div className="col-xs-6 default-reset">
          <button className="btn-reset" onClick={onRestoreDefaults}>
            Restore Default Parameters
          </button>
        </div>
      </div>
      {parameterInputs}
    </div>
  )
}

JobParameters.propTypes = {
  onChange: PropTypes.func,
  onRestoreDefaults: PropTypes.func,
  parameters: PropTypes.object,
  parametersMetadata: PropTypes.object,
  subjects: PropTypes.array,
}

JobParameters.defaultProps = {
  parameters: {},
  parametersMetadata: {},
}

export default JobParameters
