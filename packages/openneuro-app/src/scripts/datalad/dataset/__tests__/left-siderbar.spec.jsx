import React from 'react'
import { shallow } from 'enzyme'
import LeftSidebar, { SidebarRow } from '../left-sidebar.jsx'
import cookies from '../../../utils/cookies.js'

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname: '/dataset/ds000001',
  }),
}))

const fixedDate = new Date('2019-04-02T19:56:41.222Z').toString()

describe('LeftSidebar component', () => {
  it('renders with basic props', () => {
    const testDataset = {
      permissions: {
        userPermissions: [],
      },
      draft: {
        partial: false,
      },
    }
    expect(
      shallow(
        <LeftSidebar
          dataset={testDataset}
          datasetId="ds000001"
          draftModified={fixedDate}
          snapshots={[]}
        />,
      ),
    ).toMatchSnapshot()
  })
  it('renders the draft when dataset.draft.partial is true', () => {
    // Set admin token to enable edit access
    cookies.set(
      'accessToken',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJhZG1pbiI6dHJ1ZX0.F-cvL2RcfQhUtCavIM7q7zYE8drmj2LJk0JRkrS6He4',
    )
    const testDataset = {
      permissions: {
        userPermissions: [],
      },
      draft: {
        partial: true,
      },
    }
    const wrapper = shallow(
      <LeftSidebar
        dataset={testDataset}
        datasetId="ds000001"
        draftModified={fixedDate}
        snapshots={[]}
      />,
    )
    // Check that a SidebarRow is rendered
    expect(wrapper.find('SidebarRow')).toHaveLength(1)
    // Check that the first sidebar row is "draft" if the user can edit it
    expect(
      wrapper
        .find('SidebarRow')
        .first()
        .props().version,
    ).toBe('Draft')
    // Cleanup cookie for other tests
    cookies.remove('accessToken')
  })
  describe('SidebarRow', () => {
    it('renders draft version correctly', () => {
      const wrapper = shallow(
        <SidebarRow
          datasetId="ds000001"
          id="draft"
          draft
          modified={fixedDate}
        />,
      )
      expect(wrapper).toMatchSnapshot()
    })
    it('renders snapshot version correctly', () => {
      const wrapper = shallow(
        <SidebarRow
          datasetId="ds000001"
          id="ds000001:1.0.0"
          modified={fixedDate}
        />,
      )
      expect(wrapper).toMatchSnapshot()
    })
    it('toggles the active state for matching snapshot versions', () => {
      const wrapper = shallow(
        <SidebarRow
          datasetId="ds000001"
          id="ds000001:1.0.0"
          version="1.0.0"
          modified={fixedDate}
          active="1.0.0"
        />,
      )
      expect(wrapper.find('Link').hasClass('active')).toBeTruthy()
    })
    it('disables the active state for non-matching snapshot versions', () => {
      const wrapper = shallow(
        <SidebarRow
          datasetId="ds000001"
          id="ds000001:1.0.0"
          modified={fixedDate}
          active="1.0.5"
        />,
      )
      expect(wrapper.find('Link').hasClass('active')).toBeFalsy()
    })
    it('toggles the active state for matching draft versions', () => {
      const wrapper = shallow(
        <SidebarRow
          datasetId="ds000001"
          id="ds000001:1.0.0"
          modified={fixedDate}
          draft
          active="draft"
        />,
      )
      expect(wrapper.find('Link').hasClass('active')).toBeTruthy()
    })
    it('disables the active state for non-matching draft versions', () => {
      const wrapper = shallow(
        <SidebarRow
          datasetId="ds000001"
          id="ds000001:1.0.0"
          modified={fixedDate}
          draft
          active="1.0.0"
        />,
      )
      expect(wrapper.find('Link').hasClass('active')).toBeFalsy()
    })
  })
})
