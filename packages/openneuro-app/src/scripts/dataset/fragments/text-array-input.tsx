import React, { createRef, useState } from "react"
import PropTypes from "prop-types"
import styled from "@emotion/styled"

const Container = styled.div({
  position: "relative",
  width: "100%",
  height: "3rem",
  marginTop: "30px",
  backgroundColor: "white",
  borderRadius: "4px",
  border: 0,
})

const centerLabelStyles = {
  top: "1rem",
  fontSize: "1em",
}
const pushedUpLabelStyles = {
  top: "-17px",
  fontSize: "0.75em",
}

interface TextArrayInputLabelProps {
  hasValue: boolean
  hasFocus: boolean
}

const Label = styled.label<TextArrayInputLabelProps>(
  {
    position: "absolute",
    left: "1rem",
    right: "1rem",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    color: "#999",
    transition: "top 100ms, font-size 100ms",
    transitionTimingFunction: "ease-out",
    textAlign: "left",
  },
  ({ hasValue, hasFocus }) => ({
    ...(hasValue || hasFocus ? pushedUpLabelStyles : centerLabelStyles),
    ":focus": pushedUpLabelStyles,
  }),
)
const DisabledIcon = styled.i({
  "&&": {
    position: "absolute",
    top: "0.4rem",
    right: "0.4rem",
    color: "#5cb85c",
    fontSize: "8px",
  },
})
const Input = styled.input({
  width: "100%",
  height: "100%",
  padding: "13px",
  textAlign: "left",
})

const TextArrayInput = ({
  name,
  label,
  value,
  disabled,
  annotated,
  required,
  onChange,
}): React.ReactElement => {
  const [hasFocus, setHasFocus] = useState(false)

  const input = createRef<HTMLInputElement>()

  const focusInput = (): void => {
    input.current.focus()
    setHasFocus(true)
  }

  const removeFocus = (): void => {
    setHasFocus(false)
  }

  const handleChange = (e): void => {
    onChange(e.target.name, e.target.value.split(","))
  }

  return (
    <Container>
      <Label
        htmlFor={name}
        hasValue={Boolean(value)}
        hasFocus={hasFocus}
        onClick={focusInput}
      >
        {label}
      </Label>
      {annotated && <DisabledIcon className="fa fa-asterisk" />}
      <Input
        ref={input}
        name={name}
        value={value.join(", ")}
        disabled={disabled}
        required={required}
        onFocus={focusInput}
        onBlur={removeFocus}
        onChange={handleChange}
      />
    </Container>
  )
}

TextArrayInput.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.array,
  disabled: PropTypes.bool,
  annotated: PropTypes.bool,
  required: PropTypes.bool,
  onChange: PropTypes.func,
}

export default TextArrayInput
