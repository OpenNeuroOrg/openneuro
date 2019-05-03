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
const InputWrap = styled.div`
  margin: 1.5rem 0;
  width: 20em;
`
const ButtonWrap = styled.div`
  margin: 1.5rem 0;
  width: 10em;
`

const displayStates = {
  GET: Symbol('get'),
  SUCCESS: Symbol('success'),
  ERROR: Symbol('error'),
}

const submitHandler = (subscribe, setStatus) => e => {
  e.preventDefault()
  subscribe(e.target.email.value, result => {
    if (result.data) {
      setStatus(
        result.data.subscribeToNewsletter
          ? displayStates.SUCCESS
          : displayStates.ERROR,
      )
    }
  })
}

const EmailSubscriptionBox = ({ subscribe }) => {
  const [status, setStatus] = useState(displayStates.GET)
  return (
    <Container>
      <Form onSubmit={submitHandler(subscribe, setStatus)}>
        <Prompt>Get Updates</Prompt>
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
        <ButtonWrap>
          <button className="btn-blue" type="submit">
            Subscribe
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
