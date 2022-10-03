import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'
import FileTree, { unescapePath } from '../file-tree'

// official Jest workaround for mocking methods not implemented in JSDOM
window.matchMedia =
  window.matchMedia ||
  function () {
    return {
      matches: false,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    }
  }

/* eslint-disable */
jest.mock('react-spring', () => ({
  useSpring: jest.fn().mockImplementation(() => [{ mockProp: 1 }, jest.fn()]),
  animated: {
    path: () => <path data-testid="ANIMATED-COMPONENT" />,
    div: () => <div data-testid="ANIMATED-COMPONENT" />,
  },
}))
/* eslint-enable */

describe('FileTree component', () => {
  it('renders with default props', () => {
    const { asFragment } = render(<FileTree />)
    expect(asFragment()).toMatchSnapshot()
  })
  it('expands and closes when clicked', () => {
    render(
      <MockedProvider>
        <FileTree name="Top Level" />
      </MockedProvider>,
    )
    // Test the folder icon is closed
    expect(screen.getByLabelText('Top Level').firstChild).toHaveClass(
      'fa-folder',
    )
    expect(screen.getByLabelText('Top Level').firstChild).not.toHaveClass(
      'fa-folder-open',
    )
    // Click it
    fireEvent.click(screen.getByLabelText('Top Level'))
    // Test that it is now open
    expect(screen.getByLabelText('Top Level').firstChild).toHaveClass(
      'fa-folder-open',
    )
    expect(screen.getByLabelText('Top Level').firstChild).not.toHaveClass(
      'fa-folder',
    )
  })
  describe('unescapePath()', () => {
    it('does not alter an already escaped path', () => {
      expect(unescapePath('sub-01/anat')).toBe('sub-01/anat')
    })
    it('does unescapes any : characters', () => {
      expect(unescapePath('sub-01:anat')).toBe('sub-01/anat')
    })
    it('unescapes multiple : characters', () => {
      expect(unescapePath('sub-01:anat:image.nii.gz')).toBe(
        'sub-01/anat/image.nii.gz',
      )
    })
  })
})
