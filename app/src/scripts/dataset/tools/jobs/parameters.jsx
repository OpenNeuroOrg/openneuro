import React from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'
import CheckOrRadio from '../../../common/forms/multi-radio-input.jsx'

const JobParameters = ({
  parameters,
  subjects,
  onChange,
  onRestoreDefaults,
  parametersMetadata,
  arrInput,
  arrControl,
}) => {
  if (Object.keys(parameters).length === 0) {
    return <noscript />
  }
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
      if (parameter.indexOf('participant_label') > -1) {
        let onSelectChange = value => {
          // Extract list from Select's simpleValue
          let selected = value.split(',')
          let event = { target: { value: selected } }
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

        let placeholder = 'Select your ' + parametersMetadata[parameter].label
        let params = parametersMetadata[parameter].defaultValue
        // break up options for the select
        let options = []
        for (let i = 0; i < params.length; ++i) {
          options.push({ value: i, label: params[i] })
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
      input = (
        <label className="help-text">
          <input
            className="form-control"
            type="checkbox"
            name={parameter}
            onChange={onCheckChange}
            defaultChecked={isDefaultChecked}
          />
          {helpText}
        </label>
      )
    } else if (isRadio || isMulti) {
      let op = parametersMetadata[parameter].defaultValue
      // remove white spaces from options
      let options = op.filter(value => value.trim() != '')
      if (isRadio) {
        console.log(parametersMetadata[parameter])
        let handleChange = e => {
          let value = e.target.value
          let event = { target: { value: value } }
          return onChange(parameter, event)
        }

        if (parameters[parameter].indexOf(' ') !== -1) {
          parameters[parameter] = options[0]
        }
        input = (
          <div>pop!</div>
          // <CheckOrRadio
          //   type="radio"
          //   setName={parameter}
          //   options={options}
          //   selectedOptions={parameters[parameter]}
          //   controlFunc={handleChange}
          // />
        )
      } else if (isMulti) {
        // ** Adds objects to arrInput if empty ** //
        if (!arrControl.includes(parameter)) {
          arrControl.push(parameter)
          arrInput.push({ label: parameter, action: { value: [] } })
        }

        let handleChange = e => {
          let value = e.target.value
          let name = e.target.name

          // ** Use case: multiple multi checks** //
          let v = arrInput.map(obj => {
            if (obj.label === name) {
              let val = obj.action.value
              // ** Add or remove values ** //
              let index = val.indexOf(value)
              if (index === -1) {
                val.push(value)
              } else {
                val.splice(index, 1)
              }
              return val
            }
          })
          let event = { target: { value: v } }
          return onChange(parameter, event)
        }

        input = (
          <CheckOrRadio
            type="checkbox"
            setName={parameter}
            options={options}
            controlFunc={handleChange}
          />
        )
      }
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
  arrInput: PropTypes.array,
  arrControl: PropTypes.array,
}

JobParameters.defaultProps = {
  parameters: {},
  parametersMetadata: {},
}

export default JobParameters
