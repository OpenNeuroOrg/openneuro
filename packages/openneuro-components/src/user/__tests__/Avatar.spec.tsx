import '@testing-library/jest-dom/extend-expect'
import React from 'react'
import { render, screen } from '@testing-library/react'
import { Avatar, generateGravatarUrl } from '../Avatar'

describe('generateGravatarUrl', () => {
  it('returns an image for a valid object', () => {
    expect(generateGravatarUrl({ email: 'loremipsum@example.com' })).toMatch(
      /https:\/\/www.gravatar.com\//,
    )
  })
  it('returns null when no email is provided', () => {
    expect(generateGravatarUrl({})).toBe(null)
  })
})

describe('Avatar component', () => {
  it('renders with image', () => {
    render(
      <Avatar
        profile={{
          name: 'Test User',
          email: 'loreipsum@example.com',
        }}
      />,
    )
    expect(screen.getByRole('img')).toBeInTheDocument()
  })
  it('renders a default with no image', () => {
    render(
      <Avatar
        profile={{
          name: 'Test User',
        }}
      />,
    )
    expect(screen.queryByRole('img')).toBeNull()
    expect(screen.getByText('T')).toBeInTheDocument()
  })
})
