import { describe, it, expect, vi } from 'vitest'
import React from 'react'
import { render, screen } from '@testing-library/react'
import { UserLoginModal } from '../UserLoginModal'
import { MemoryRouter } from 'react-router-dom'

const loginUrls = {
  google: 'https://openneuro.org/crn/auth/google',
  orcid: 'https://openneuro.org/crn/auth/orcid',
}

const toggle = vi.fn()

describe('UserLoginModal component', () => {
  it('Google login link has correctly formed auth URL', () => {
    render(
      <MemoryRouter initialEntries={['/import?url=https://example.com']}>
        <UserLoginModal isOpen={true} toggle={toggle} loginUrls={loginUrls} />
      </MemoryRouter>,
    )
    expect(
      screen.getByRole('link', { name: /google/i }).getAttribute('href'),
    ).toBe(
      'https://openneuro.org/crn/auth/google?redirectPath=L2ltcG9ydD91cmw9aHR0cHM6Ly9leGFtcGxlLmNvbQ==',
    )
  })
  it('ORCID login link has correctly formed auth URL', () => {
    render(
      <MemoryRouter initialEntries={['/import']}>
        <UserLoginModal isOpen={true} toggle={toggle} loginUrls={loginUrls} />
      </MemoryRouter>,
    )
    expect(
      screen.getByRole('link', { name: /orcid/i }).getAttribute('href'),
    ).toBe('https://openneuro.org/crn/auth/orcid?redirectPath=L2ltcG9ydA==')
  })
})
