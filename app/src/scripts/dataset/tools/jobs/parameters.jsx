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
  setDefault,
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
    } else if (isRadio || isCheckbox) {
      let options = parametersMetadata[parameter].options
      let handleChange = e => {
        let value = e.target.value
        let event = { target: { value: value } }
        return onChange(parameter, event)
      }

      if (isRadio) {
        input = (
          <CheckOrRadio
            type="radio"
            setName={parameter}
            options={options}
            controlFunc={handleChange}
          />
        )
      } else if (isCheckbox) {
        let defCheck = parametersMetadata[parameter].defaultChecked
        // ** only for multi checkboxes ** //
        if (!arrInput.length) {
          if (defCheck.length) {
            for (let opt of defCheck) {
              if (!arrInput.includes(opt) && opt != '') {
                arrInput.push(opt)
              }
            }
            let event = { target: { value: arrInput } }
            setDefault(parameter, event)
          }
        } else {
          handleChange = e => {
            // need to add def checked
            let value = e.target.value
            // ** Add or remove values ** //
            let index = arrInput.indexOf(value)
            if (index === -1) {
              arrInput.push(value)
            } else {
              arrInput.splice(index, 1)
            }

            let event = { target: { value: arrInput } }
            return onChange(parameter, event)
          }
        }

        input = (
          <CheckOrRadio
            type="checkbox"
            setName={parameter}
            options={options}
            controlFunc={handleChange}
            selectedOptions={arrInput}
          />
        )
      }
    } else if (isMulti) {
      input = (
        <div>
          <span>
            Sorry, this input type is deprecated. Please contact the creators of
            this app for support.
          </span>
        </div>
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

    let help_text = (
      <span className="help-text">
        {parametersMetadata[parameter]
          ? parametersMetadata[parameter].description
          : parameter}
      </span>
    )

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
  setDefault: PropTypes.func,
}

JobParameters.defaultProps = {
  parameters: {},
  parametersMetadata: {},
}

export default JobParameters
