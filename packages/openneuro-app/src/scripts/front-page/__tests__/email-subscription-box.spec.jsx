import React from 'react'
import { mount } from 'enzyme'
import EmailSubscriptionBox, {
  modes,
  submitHandler,
} from '../email-subscription-box.jsx'

describe('EmailSubscriptionBox', () => {
  it('renders correctly in get-email mode', () => {
    const wrapper = mount(
      <EmailSubscriptionBox subscribe={() => {}} initialMode={modes.GET} />,
    )
    expect(wrapper).toMatchSnapshot()
  })
  it('renders correctly in success mode', () => {
    const wrapper = mount(
      <EmailSubscriptionBox subscribe={() => {}} initialMode={modes.GET} />,
    )
    expect(wrapper).toMatchSnapshot()
  })
  it('renders correctly in error mode', () => {
    const wrapper = mount(
      <EmailSubscriptionBox subscribe={() => {}} initialMode={modes.GET} />,
    )
    expect(wrapper).toMatchSnapshot()
  })
})

describe('EmailSubscriptionBox submitHandler', () => {
  const event = {
    preventDefault: () => {},
    target: { email: { value: 'email@email.test' } },
  }
  it('calls setMode with GET when in ERROR mode', () => {
    const subscribe = () => {}
    const currentMode = modes.ERROR
    const setMode = newMode => expect(newMode).toEqual(modes.GET)
    submitHandler(subscribe, currentMode, setMode)(event)
  })

  describe('properly handles setMode when email is submitted in GET mode', () => {
    const currentMode = modes.GET

    it('calls SUCCESS mode for successful submit', () => {
      const result = { data: { subscribeToNewsletter: true } }
      const subscribe = (someValidEmail, cb) => cb(result)
      const setMode = newMode => expect(newMode).toEqual(modes.SUCCESS)
      submitHandler(subscribe, currentMode, setMode)(event)
    })
    it('calls ERROR mode for unsuccessful submit', () => {
      const result = { data: { subscribeToNewsletter: false } }
      const subscribe = (someValidEmail, cb) => cb(result)
      const setMode = newMode => expect(newMode).toEqual(modes.ERROR)
      submitHandler(subscribe, currentMode, setMode)(event)
    })
  })
})
