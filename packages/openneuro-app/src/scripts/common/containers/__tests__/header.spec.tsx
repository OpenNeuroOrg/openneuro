import React from 'react'
import { MockAppShell } from '../../../__utils__/mock-app-shell'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { HeaderContainer } from '../header'

jest.mock(
  '../../../uploader/uploader-view.jsx',
  () => () => 'mocked UploaderView',
)

const mockNavigate = jest.fn()

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}))

describe('HeaderContainer component', () => {
  it('navigates prepopulated search when you use the home page search box', async () => {
    render(<HeaderContainer />, { wrapper: MockAppShell })
    const searchbox = screen.getByRole('textbox')
    const button = screen.getByLabelText('Search')
    await fireEvent.change(searchbox, { target: { value: 'test argument' } })
    await fireEvent.click(button)
    await waitFor(() =>
      expect(mockNavigate).toHaveBeenCalledWith(
        '/search?query={"keywords":["test argument"]}',
      ),
    )
  })
})
