import React from 'react'
import { shallow } from 'enzyme'
import { render, screen } from '@testing-library/react'
import { DatasetContent, HasBeenPublished } from '../dataset-content.jsx'
import { hasEditPermissions } from '../../../refactor_2021/authentication/profile.js'
import { BrowserRouter } from 'react-router-dom'
import cookies from '../../../utils/cookies.js'

// eslint-disable-next-line
jest.mock('../../fragments/dataset-files.jsx', () => () => (
  <div>Mock File Tree</div>
))

describe('DatasetContent component', () => {
  describe('HasBeenPublished', () => {
    it('public datasets show success banner', () => {
      const wrapper = shallow(<HasBeenPublished datasetId="1" />)
      expect(wrapper.at(0).hasClass('alert-success')).toBeTruthy()
    })
    it('public datasets with draft changes show warning banner', () => {
      const wrapper = shallow(
        <HasBeenPublished datasetId="1" hasDraftChanges />,
      )
      expect(wrapper.at(0).hasClass('alert-warning')).toBeTruthy()
    })
    it('non-public datasets show warning banner', () => {
      const wrapper = shallow(<HasBeenPublished datasetId="1" isPrivate />)
      expect(wrapper.at(0).hasClass('alert-warning')).toBeTruthy()
    })
  })
  describe('hasEditPermissions()', () => {
    it('returns false for anonymous users', () => {
      expect(hasEditPermissions([{}])).toBe(false)
    })
    it('returns true for admin users', () => {
      expect(
        hasEditPermissions(
          { userPermissions: [{ user: { id: '1234' }, level: 'admin' }] },
          '1234',
        ),
      ).toBe(true)
    })
    it('returns true for rw users', () => {
      expect(
        hasEditPermissions(
          { userPermissions: [{ user: { id: '1234' }, level: 'rw' }] },
          '1234',
        ),
      ).toBe(true)
    })
    it('returns false for ro users', () => {
      expect(
        hasEditPermissions(
          { userPermissions: [{ user: { id: '1234' }, level: 'ro' }] },
          '1234',
        ),
      ).toBe(false)
    })
  })
  it('renders when no snapshots are present', () => {
    const datasetDraftOnly = {
      created: '2021-01-26T17:10:53.738Z',
      public: false,
      draft: {
        modified: '2021-01-26T17:10:53.738Z',
        head: 'deb75470ec18e8656f4d6f7ad4b0f3b65bad7884',
        description: {
          Name: 'test dataset',
        },
        files: [{}],
        issues: [],
      },
      permissions: {
        userPermissions: [
          {
            level: 'admin',
            user: { id: '123456', email: 'tests@example.com' },
          },
        ],
      },
      analytics: {
        downloads: 1,
        views: 1,
      },
      snapshots: [],
      metadata: null,
      uploader: {
        name: 'test user',
      },
      worker: 'dataset-worker-0',
    }
    cookies.set(
      'accessToken',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTYiLCJlbWFpbCI6InRlc3RzQGV4YW1wbGUuY29tIiwicHJvdmlkZXIiOiJnb29nbGUiLCJuYW1lIjoiVGVzdCBVc2VyIiwiYWRtaW4iOmZhbHNlLCJpYXQiOjE2MTE2ODEwNjcsImV4cCI6MjE0NzQ4MzY0N30.fDNpHGjvzCodz7OlKrFudHRioPoDSnufi6saeAyAqBA',
    )
    render(
      <BrowserRouter>
        <DatasetContent dataset={datasetDraftOnly} />
      </BrowserRouter>,
    )
    // Look for some text that's always rendered
    expect(screen.getAllByText('README').pop()).toHaveTextContent('README')
    // Verify something specific to this example dataset
    expect(screen.getAllByText('test dataset').pop()).toHaveTextContent(
      'test dataset',
    )
  })
})
