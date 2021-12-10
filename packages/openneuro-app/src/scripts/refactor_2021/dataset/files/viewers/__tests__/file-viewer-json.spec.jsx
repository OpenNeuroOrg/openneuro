import React from 'react'
import { render } from '@testing-library/react'
import { FileViewerJsonRaw } from '../file-viewer-json.jsx'

describe('File Viewer - JSON', () => {
  it('renders with valid JSON', () => {
    const validJson = JSON.stringify({ thing: 1, name: 'string' })
    const { asFragment } = render(<FileViewerJsonRaw jsonRaw={validJson} />)
    expect(asFragment()).toMatchSnapshot()
  })
  it('renders with invalid JSON', () => {
    const { asFragment } = render(<FileViewerJsonRaw jsonRaw="1234;" />)
    expect(asFragment()).toMatchSnapshot()
  })
})
