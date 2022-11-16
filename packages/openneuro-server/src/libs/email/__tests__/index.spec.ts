import { describe, it, expect, vi } from 'vitest'
import { mailjetFormat } from '../index'

vi.mock('../../../config.js')

describe('Mailjet formatter', () => {
  it('formats a message', () => {
    const testMessage = {
      to: 'test@example.com',
      name: 'Test User',
      html: 'email content goes here',
      subject: 'subject line',
    }
    expect(mailjetFormat(testMessage)).toEqual({
      Messages: [
        {
          From: { Email: 'notifications@example.com', Name: 'OpenNeuro' },
          HTMLPart: 'email content goes here',
          Subject: 'subject line',
          To: [{ Email: 'test@example.com', Name: 'Test User' }],
        },
      ],
    })
  })
})
