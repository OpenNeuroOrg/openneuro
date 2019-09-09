import React from 'react'
import TextInput from './text-input.jsx'
import { PropTypes } from 'prop-types'
import styled from '@emotion/styled'

const Container = styled.div({
  position: 'relative',
  width: '100%',
  height: '4rem',
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
const Label = styled.label(
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
const Select = styled.select(
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
  },
  ({ showOther }) =>
    showOther
      ? {
          borderBottomRightRadius: 0,
          borderBottomLeftRadius: 0,
        }
      : {},
)
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
const SelectIcon = () => (
  <SelectIconContainer>
    <i className="fa fa-caret-up" />
    <i className="fa fa-caret-down" />
  </SelectIconContainer>
)
const OtherInputContainer = styled.div(
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
          height: '4rem',
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
  required,
  onChange,
}) => {
  const defaultOptions = options.map(option => option.value)
  const nothingSelected = !Boolean(value)
  const otherOptionSelected =
    !nothingSelected && !defaultOptions.includes(value)

  let selectValue
  if (nothingSelected) selectValue = ''
  else if (otherOptionSelected) selectValue = 'Other'
  else selectValue = value

  const handleChange = e => onChange(e.target.name, e.target.value)

  return (
    <>
      <Container>
        <Label htmlFor={name} hasValue={Boolean(value)}>
          {label}
        </Label>
        {disabled && <DisabledIcon className="fa fa-asterisk" />}
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
          <option value="" disabled hidden />
          {options &&
            options.map((option, i) => (
              <option value={option.value} key={i}>
                {option.text || option.value}
              </option>
            ))}
          {showOptionOther && <option value="Other">Other</option>}
        </Select>
      </Container>
      <OtherInputContainer showOther={showOptionOther && otherOptionSelected}>
        <TextInput
          name={name}
          label={`Other ${label}`}
          value={value === 'Other' ? '' : value}
          disabled={disabled}
          onChange={onChange}
        />
      </OtherInputContainer>
    </>
  )
}

SelectInput.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.string,
  options: PropTypes.array,
  showOptionOthers: PropTypes.bool,
  handleChange: PropTypes.func,
}

export default SelectInput
