import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from '@emotion/styled'

const Container = styled.div`
  padding: 2em 0 4em;
  background-color: white;
`
const Form = styled.form`
  margin: 0 auto;
  padding: 1.5rem 0;
  width: 80vw;
  min-width: 24em;
  max-width: 90rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f5f5f5;
`
const Prompt = styled.h3`
  margin: 1.5rem 0;
  font-size: 40px;
  font-weight: 200;
`
const Message = styled.p`
  padding: 1.1em 0;
`
const InputWrap = styled.div`
  margin: 1.5rem 0;
  width: 20em;
`
const ButtonWrap = styled.div`
  margin: 1.5rem 0;
  width: 10em;
`

const modes = {
  // display prompt / email input / submit button
  GET: Symbol('get'),
  // display success message / done
  SUCCESS: Symbol('success'),
  // display error message / try again button
  ERROR: Symbol('error'),
}

const submitHandler = (subscribe, mode, setMode) => e => {
  e.preventDefault()
  switch (mode) {
    case modes.SUCCESS:
      break
    case modes.ERROR:
      setMode(modes.GET)
      break
    case modes.GET:
    default:
      subscribe(e.target.email.value, result => {
        if (result.data) {
          setMode(
            result.data.subscribeToNewsletter ? modes.SUCCESS : modes.ERROR,
          )
        }
      })
      break
  }
}

const getText = mode => {
  switch (mode) {
    case modes.ERROR:
      return {
        headingText: 'Whoops.',
        messageText:
          'We were unable to sign you up for updates. Please try again.',
        buttonText: 'Try Again',
      }
    case modes.SUCCESS:
      return {
        headingText: 'Success!',
        messageText: 'You are now signed up to receive news updates.',
        buttonText: 'Done',
      }
    case modes.GET:
    default:
      return {
        headingText: 'Get Updates',
        buttonText: 'Subscribe',
      }
  }
}

const EmailSubscriptionBox = ({ subscribe }) => {
  // determines state of display (input/success/error)
  const [mode, setMode] = useState(modes.GET)
  const { headingText, messageText, buttonText } = getText(mode)
  return (
    <Container>
      <Form onSubmit={submitHandler(subscribe, mode, setMode)}>
        <Prompt>{headingText}</Prompt>
        {mode === modes.ERROR || mode === modes.SUCCESS ? (
          <Message>{messageText}</Message>
        ) : (
          <InputWrap className="has-float-label">
            <input
              name="email"
              className="form-control"
              id="email"
              type="text"
              placeholder=" "
            />
            <label htmlFor="email">E-mail Address</label>
          </InputWrap>
        )}
        <ButtonWrap>
          <button
            className="btn-blue"
            type="submit"
            disabled={mode === modes.SUCCESS}>
            {buttonText}
          </button>
        </ButtonWrap>
      </Form>
    </Container>
  )
}

EmailSubscriptionBox.propTypes = {
  subscribe: PropTypes.func,
}

export default EmailSubscriptionBox
