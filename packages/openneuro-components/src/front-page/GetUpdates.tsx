import React from 'react'
import { Button } from '../button/Button'
import { Input } from '../input/Input'

export const modes = {
  // display prompt / email input / submit button
  GET: Symbol('get'),
  // display success message / done
  SUCCESS: Symbol('success'),
  // display error message / try again button
  ERROR: Symbol('error'),
}

export const submitHandler = (subscribe, mode, setMode, value) => e => {
  e.preventDefault()
  switch (mode) {
    case modes.SUCCESS:
      break
    case modes.ERROR:
      setMode(modes.GET)
      break
    case modes.GET:
    default:
      subscribe(value, result => {
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
        messageText: 'Find out about new version and future releases',
      }
  }
}

export const GetUpdates = ({ subscribe, initialMode = modes.GET }) => {
  const [mode, setMode] = React.useState(initialMode)
  const [value, setValue] = React.useState('')
  const { headingText, messageText, buttonText } = getText(mode)
  return (
    <div className="get-updates-bar">
      <div className="get-updates-label">
        <h2>{headingText}</h2>
        <h3>{messageText}</h3>
      </div>
      <form
        onSubmit={submitHandler(subscribe, mode, setMode, value)}
        className="get-updates-form">
        <>
          <div className="">{}</div>
          {mode === modes.GET && (
            <Input
              type="email"
              label="Email Address"
              placeholder="email@openneuro.com"
              labelStyle="float"
              name="float-example"
              value={value}
              setValue={setValue}
            />
          )}
          <Button
            type="submit"
            secondary
            label={buttonText}
            disabled={mode === modes.SUCCESS}
          />
        </>
      </form>
    </div>
  )
}
