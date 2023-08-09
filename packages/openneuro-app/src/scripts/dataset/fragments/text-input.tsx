import React, { useState, createRef } from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'

interface TextInputContainerProps {
  textarea: boolean
}

const Container = styled.div<TextInputContainerProps>(
  {
    position: 'relative',
    width: '100%',
    height: '3rem',
    marginTop: '30px',
    backgroundColor: 'white',
    borderRadius: '4px',
  },
  ({ textarea }) =>
    textarea
      ? {}
      : {
          height: '3rem',
        },
)
const centerLabelStyles = {
  top: '13px',
  fontSize: '1em',
}
const pushedUpLabelStyles = {
  top: '-17px',
  fontSize: '0.75em',
}

interface TextInputLabelProps {
  hasValue: boolean
  hasFocus: boolean
}

const Label = styled.label<TextInputLabelProps>(
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
  ({ hasValue, hasFocus }) => ({
    ...(hasValue || hasFocus ? pushedUpLabelStyles : centerLabelStyles),
    ':focus': pushedUpLabelStyles,
  }),
)
const DisabledIcon = styled.i({
  '&&': {
    position: 'absolute',
    top: '0.4rem',
    right: '0.4rem',
    color: '#5cb85c',
    fontSize: '8px',
  },
})
const Input = styled.input({
  width: '100%',
  height: '100%',
  padding: '13px',
  textAlign: 'left',
})
const Textarea = styled.textarea({
  width: '100%',
  borderRadius: '5px',
  textAlign: 'left',
  padding: '13px',
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

const TextInput = ({
  name,
  label,
  hoverText,
  value,
  disabled,
  annotated,
  textarea,
  nullMessage,
  required,
  onChange,
}): React.ReactElement => {
  if (value === null || value === undefined) {
    if (nullMessage) value = nullMessage
    else value = ''
  } else value = value.toString()
  const [hasFocus, setHasFocus] = useState(false)
  const [isShown, setIsShown] = useState(false)
  const textAreaRef = createRef<HTMLTextAreaElement>()
  const inputRef = createRef<HTMLInputElement>()

  const focusInput = (): void => {
    if (textarea) {
      textAreaRef.current.focus()
    } else {
      inputRef.current.focus()
    }
    setHasFocus(true)
  }

  const removeFocus = (): void => {
    setHasFocus(false)
  }

  const handleChange = (e): void => {
    onChange(e.target.name, e.target.value)
  }

  return (
    <Container textarea={textarea}>
      <Label
        htmlFor={name}
        hasValue={Boolean(value)}
        hasFocus={hasFocus}
        onClick={focusInput}
        onMouseEnter={(): void => {
          setIsShown(true)
        }}
        onMouseLeave={(): void => {
          setIsShown(false)
        }}>
        {label}
      </Label>
      {annotated && <DisabledIcon className="fa fa-asterisk" />}
      {textarea ? (
        <Textarea
          ref={textAreaRef}
          name={name}
          value={value}
          onFocus={focusInput}
          onBlur={removeFocus}
          onChange={handleChange}
          onMouseEnter={(): void => {
            setIsShown(true)
          }}
          onMouseLeave={(): void => {
            setIsShown(false)
          }}
        />
      ) : (
        <Input
          ref={inputRef}
          name={name}
          value={value}
          disabled={disabled}
          onFocus={focusInput}
          onBlur={removeFocus}
          onChange={handleChange}
          required={required}
          onMouseEnter={(): void => {
            setIsShown(true)
          }}
          onMouseLeave={(): void => {
            setIsShown(false)
          }}
        />
      )}
      {isShown && hoverText && <HoverMessage>{hoverText}</HoverMessage>}
    </Container>
  )
}

TextInput.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  hoverText: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.array,
    PropTypes.bool,
  ]),
  disabled: PropTypes.bool,
  annotated: PropTypes.bool,
  required: PropTypes.bool,
  textarea: PropTypes.bool,
  nullMessage: PropTypes.string,
  onChange: PropTypes.func,
}

export default TextInput
