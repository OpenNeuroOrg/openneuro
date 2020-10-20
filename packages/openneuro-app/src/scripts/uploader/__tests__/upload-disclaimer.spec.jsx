import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import UploadDisclaimer from '../upload-disclaimer.jsx'
import UploaderContext from '../uploader-context.js'

describe('UploadDisclaimer component', () => {
  it('renders as expected', () => {
    expect(() =>
      render(
        <UploaderContext.Provider value={{ uploader: jest.fn() }}>
          <UploadDisclaimer />
        </UploaderContext.Provider>,
      ),
    ).not.toThrowError()
  })
  it('starts with the upload button disabled', () => {
    render(
      <UploaderContext.Provider value={{ uploader: jest.fn() }}>
        <UploadDisclaimer />
      </UploaderContext.Provider>,
    )
    expect(screen.getByText('I Agree')).toBeDisabled()
  })
  it('enabled the upload button when both boxes are checked', () => {
    const { getByLabelText } = render(
      <UploaderContext.Provider value={{ uploader: jest.fn() }}>
        <UploadDisclaimer />
      </UploaderContext.Provider>,
    )
    fireEvent.click(
      getByLabelText(
        'All structural scans have been defaced, obscuring any tissue on or near the face that could potentially be used to reconstruct the facial structure.',
      ),
    )
    fireEvent.click(
      getByLabelText(
        'I have explicit participant consent and ethical authorization to publish structural scans without defacing.',
      ),
    )
    expect(screen.getByText('I Agree')).not.toBeDisabled()
  })
  it('enable the upload button when one box is checked', () => {
    const { getByLabelText } = render(
      <UploaderContext.Provider value={{ uploader: jest.fn() }}>
        <UploadDisclaimer />
      </UploaderContext.Provider>,
    )
    fireEvent.click(
      getByLabelText(
        'All structural scans have been defaced, obscuring any tissue on or near the face that could potentially be used to reconstruct the facial structure.',
      ),
    )
    expect(screen.getByText('I Agree')).not.toBeDisabled()
    // Disable the first and enable the second to test the alternate state
    fireEvent.click(
      getByLabelText(
        'All structural scans have been defaced, obscuring any tissue on or near the face that could potentially be used to reconstruct the facial structure.',
      ),
    )
    fireEvent.click(
      getByLabelText(
        'I have explicit participant consent and ethical authorization to publish structural scans without defacing.',
      ),
    )
    expect(screen.getByText('I Agree')).not.toBeDisabled()
  })
})
