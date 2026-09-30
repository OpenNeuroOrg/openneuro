import React, { useState } from "react"
import PropTypes from "prop-types"
import styled from "@emotion/styled"

const Container = styled.div({
  position: "relative",
  width: "100%",
  marginTop: "30px",
  textAlign: "left",
})

interface CheckboxLabelProps {
  disabled?: boolean
}

const Label = styled.label<CheckboxLabelProps>(
  {
    display: "flex",
    alignItems: "flex-start",
    fontSize: "14px",
    fontWeight: "bold",
    color: "#333",
    margin: 0,
    userSelect: "none",
  },
  ({ disabled }) => ({
    cursor: disabled ? "not-allowed" : "pointer",
  }),
)

const Input = styled.input({
  margin: "2px 8px 0 0",
  flexShrink: 0,
  cursor: "pointer",
  "&:disabled": {
    cursor: "not-allowed",
  },
})

const LabelText = styled.span({
  lineHeight: "1.4",
})

const DisabledIcon = styled.i({
  "&&": {
    marginLeft: "0.5rem",
    color: "#5cb85c",
    fontSize: "8px",
    verticalAlign: "middle",
  },
})

const Description = styled.div({
  marginTop: "4px",
  marginLeft: "21px",
  fontSize: "12px",
  color: "#666",
  lineHeight: "1.4",
})

const HoverMessage = styled.span`
  position: relative;
  z-index: 100000;
  height: 24px;
  font-size: 12px;
  box-shadow: 0 0 0 #ddd;
  transition: opacity 0.4s ease-out, box-shadow 0.4s ease-out;
  white-space: nowrap;
  overflow: visible;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-weight: normal;
  line-height: 1.4;
  color: #fff;
  padding: 3px 8px;
  text-align: center;
  text-decoration: none;
  background-color: #000;
  border-radius: 4px;
`

export interface CheckboxInputProps {
  name: string
  label: string
  description?: string
  extendedDescription?: string
  hoverText?: string
  value?: boolean | string
  disabled?: boolean
  annotated?: boolean
  required?: boolean
  onChange: (name: string, value: boolean) => void
}

const CheckboxInput = ({
  name,
  label,
  description,
  extendedDescription,
  hoverText,
  value,
  disabled = false,
  annotated = false,
  required = false,
  onChange,
}: CheckboxInputProps): React.ReactElement => {
  const checked = typeof value === "boolean"
    ? value
    : typeof value === "string"
    ? value === "true"
    : Boolean(value)

  const [isShown, setIsShown] = useState(false)

  const desc = description || extendedDescription

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    onChange?.(e.target.name || name, e.target.checked)
  }

  return (
    <Container>
      <Label
        htmlFor={name}
        disabled={disabled}
        onMouseEnter={(): void => {
          setIsShown(true)
        }}
        onMouseLeave={(): void => {
          setIsShown(false)
        }}
      >
        <Input
          type="checkbox"
          id={name}
          name={name}
          checked={checked}
          disabled={disabled}
          required={required}
          onChange={handleChange}
        />
        <LabelText>{label}</LabelText>
        {annotated && <DisabledIcon className="fa fa-asterisk" />}
      </Label>
      {desc && <Description>{desc}</Description>}
      {isShown && hoverText && <HoverMessage>{hoverText}</HoverMessage>}
    </Container>
  )
}

CheckboxInput.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  description: PropTypes.string,
  extendedDescription: PropTypes.string,
  hoverText: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  disabled: PropTypes.bool,
  annotated: PropTypes.bool,
  required: PropTypes.bool,
  onChange: PropTypes.func,
}

export default CheckboxInput
