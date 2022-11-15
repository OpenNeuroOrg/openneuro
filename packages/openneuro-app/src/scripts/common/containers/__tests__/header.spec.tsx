import React from 'react'
import { MockAppShell } from '../../../__utils__/mock-app-shell'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { HeaderContainer } from '../header'
import { vi } from 'vitest'
import * as rrd from 'react-router-dom'

vi.mock('../../../config.ts')

vi.mock(
  '../../../uploader/uploader-view.jsx',
  () => () => 'mocked UploaderView',
)

const useNavigate = vi.spyOn(rrd, 'useNavigate')

describe('HeaderContainer component', () => {
  it('navigates prepopulated search when you use the home page search box', async () => {
    render(<HeaderContainer />, { wrapper: MockAppShell })
    const searchbox = screen.getByRole('textbox')
    const button = screen.getByLabelText('Search')
    await fireEvent.change(searchbox, { target: { value: 'test argument' } })
    await fireEvent.click(button)
    await waitFor(() =>
      expect(useNavigate).toHaveBeenCalledWith(
        '/search?query={"keywords":["test argument"]}',
      ),
    )
  })
})
