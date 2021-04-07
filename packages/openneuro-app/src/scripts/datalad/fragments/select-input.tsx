import React, { useState } from 'react'
import TextInput from './text-input'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'

const Container = styled.div({
  position: 'relative',
  width: '100%',
  height: '4.5rem',
  backgroundColor: 'white',
  borderRadius: '5px',
})
const centerLabelStyles = {
  top: '1rem',
  fontSize: '1em',
}
const pushedUpLabelStyles = {
  top: '0.4rem',
  fontSize: '0.75em',
}

interface SelectInputLabelProps {
  hasValue: boolean
}

const Label = styled.label<SelectInputLabelProps>(
  {
    position: 'absolute',
    left: '1rem',
    right: '1rem',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    color: '#999',
    transition: 'top 100ms, font-size 100ms',
    transitionTimingFunction: 'ease-out',
    textAlign: 'left',
  },
  ({ hasValue }) => ({
    ...(hasValue ? pushedUpLabelStyles : centerLabelStyles),
    ':focus': pushedUpLabelStyles,
  }),
)
const DisabledIcon = styled.i({
  position: 'absolute',
  top: '0.4rem',
  right: '0.4rem',
  color: '#5cb85c',
})

interface ShowOtherProps {
  showOther: boolean
}
const Select = styled.select<ShowOtherProps>(
  {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: '100%',
    height: '100%',
    border: '2px inset #eee',
    color: 'rgba(0,0,0,0)',
    backgroundColor: 'rgba(0,0,0,0)',
    '-moz-appearance': 'none',
  },
  ({ showOther }) =>
    showOther
      ? {
          borderBottomRightRadius: 0,
          borderBottomLeftRadius: 0,
        }
      : {},
)
Select.displayName = 'styledSelect'
const SelectValueDisplay = styled.div({
  position: 'absolute',
  top: 0,
  width: '100%',
  height: '100%',
  padding: '1.7rem 1rem 0',
  color: 'black',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  textAlign: 'left',
})
const SelectIconContainer = styled.div({
  position: 'absolute',
  top: 0,
  right: 0,
  height: '100%',
  width: '3rem',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  color: '#999',
})
const SelectIcon = (): React.ReactElement => (
  <SelectIconContainer>
    <i className="fa fa-caret-up" />
    <i className="fa fa-caret-down" />
  </SelectIconContainer>
)
const Option = styled.option({
  color: 'black',
})
const OtherInputContainer = styled.div<ShowOtherProps>(
  {
    marginBottom: '0.5rem',
    overflow: 'hidden',
    transition: 'opacity, transform, height',
    transitionDuration: '200ms',
    transitionTimingFunction: 'ease-out',

    input: {
      borderTopRightRadius: 0,
      borderTopLeftRadius: 0,
    },
  },
  ({ showOther }) =>
    showOther
      ? {
          height: '4.5rem',
          opacity: 1,
          transform: 'translateY(0)',
        }
      : {
          height: 0,
          opacity: 0,
          transform: 'translateY(-4rem)',
        },
)
const SelectInput = ({
  name,
  label,
  value,
  options,
  showOptionOther,
  disabled,
  annotated,
  required,
  warningOnChange = '',
  onChange,
  hasBooleanValues,
}): React.ReactElement => {
  if (hasBooleanValues && typeof value === 'boolean') {
    value = value.toString()
  }
  const nothingSelected = !value
  const otherOptionSelected = showOptionOther && value === 'Other'

  let selectValue
  if (nothingSelected) selectValue = ''
  else if (otherOptionSelected) selectValue = 'Other'
  else selectValue = value

  const [changed, setChanged] = useState(false)

  const handleChange = (e): void => {
    const prevValue = value
    let newValue = e.target.value
    if (hasBooleanValues) {
      if (newValue === 'true') newValue = true
      else if (newValue === 'false') newValue = false
    }
    if (prevValue != newValue) setChanged(true)
    onChange(e.target.name, newValue)
  }

  const labelString: string = label

  return (
    <>
      <Container>
        <Label htmlFor={name} hasValue={Boolean(value)}>
          {label}
        </Label>
        {annotated && <DisabledIcon className="fa fa-asterisk" />}
        {/* Shows contents of select box, including value and up/down icon */}
        <SelectValueDisplay>
          {value}
          <SelectIcon />
        </SelectValueDisplay>
        {/* default children and background of select box are set to transparent */}
        <Select
          name={name}
          value={selectValue}
          disabled={disabled}
          onChange={handleChange}
          showOther={showOptionOther && otherOptionSelected}
          required={required}>
          <Option value="" disabled hidden />
          {options &&
            options.map((option, i) => (
              <Option value={option.value} key={i}>
                {option.text || option.value}
              </Option>
            ))}
          {showOptionOther && <Option value="Other">Other</Option>}
        </Select>
      </Container>
      <OtherInputContainer showOther={showOptionOther && otherOptionSelected}>
        <TextInput
          name={name}
          label={`Other ${labelString}`}
          value={value === 'Other' ? '' : value}
          disabled={disabled}
          onChange={onChange}
        />
      </OtherInputContainer>
      {changed && <p>{warningOnChange}</p>}
    </>
  )
}

SelectInput.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  options: PropTypes.array,
  showOptionOther: PropTypes.bool,
  disabled: PropTypes.bool,
  annotated: PropTypes.bool,
  required: PropTypes.bool,
  warningOnChange: PropTypes.string,
  onChange: PropTypes.func,
  handleChange: PropTypes.func,
  hasBooleanValues: PropTypes.bool,
}

export default SelectInput
