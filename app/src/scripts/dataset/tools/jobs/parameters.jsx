import React from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'
import Radio from '../../../common/forms/radio.jsx'
import MultiCheckbox from '../../../common/forms/multi-checkbox.jsx'

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
  const parameterInputs = Object.keys(parameters).map(parameter => {
    let input
    let isCheckbox = parametersMetadata[parameter].type === 'checkbox'
    let isMulti = parametersMetadata[parameter].type === 'multi'
    let isSelect = parametersMetadata[parameter].type === 'select'
    let isRadio = parametersMetadata[parameter].type === 'radio'
    let isFile = parametersMetadata[parameter].type === 'file'
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
        let params = parametersMetadata[parameter].options
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
    } else if (isRadio) {
      const options = parametersMetadata[parameter].options
      const handleChange = e => {
        const value = e.target.value
        const event = { target: { value: value } }
        return onChange(parameter, event)
      }

      if (isRadio) {
        input = (
          <Radio
            setName={parameter}
            options={options}
            onChange={handleChange}
            value={parameters[parameter]}
          />
        )
      }
    } else if (isMulti) {
      const handleChange = e => {
        // need to add def checked
        const value = e.target.value
        const arrParam = parameters[parameter]

        // ** Add or remove values ** //
        let index = arrParam.indexOf(value)
        if (index === -1) {
          arrParam.push(value)
        } else {
          arrParam.splice(index, 1)
        }

        let event = { target: { value: arrParam } }
        return onChange(parameter, event)
      }

      input = (
        <MultiCheckbox
          setName={parameter}
          options={parametersMetadata[parameter].options}
          onChange={handleChange}
          selectedOptions={parameters[parameter]}
        />
      )
    } else if (isCheckbox) {
      const onCheck = e => {
        const value = e.target.checked
        const event = { target: { value: value } }
        return onChange(parameter, event)
      }
      input = (
        <label className="help-text">
          <input
            className="form-control"
            type="checkbox"
            name={parameter}
            checked={parameters[parameter]}
            onChange={onCheck}
          />
          {parametersMetadata[parameter]
            ? parametersMetadata[parameter].description
            : parameter}
        </label>
      )
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

    if (!isCheckbox) {
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
  setDefault: PropTypes.func,
}

JobParameters.defaultProps = {
  parameters: {},
  parametersMetadata: {},
}

export default JobParameters
