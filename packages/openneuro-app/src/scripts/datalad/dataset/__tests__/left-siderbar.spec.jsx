import React from 'react'
import { mount } from 'enzyme'
import LeftSidebar, { SidebarRow } from '../left-sidebar.jsx'

const fixedDate = new Date('2019-04-02T19:56:41.222Z')

describe('LeftSidebar component', () => {
  it('renders with basic props', () => {
    expect(
      shallow(
        <LeftSidebar
          datasetId="ds000001"
          draftModified={fixedDate}
          snapshots={[]}
          location="/dataset/ds000001"
        />,
      ),
    ).toMatchSnapshot()
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
        expect(wrapper).toMatchSnapshot(),
      )
    })
    it('renders snapshot version correctly', () => {
      const wrapper = shallow(
        <SidebarRow
          datasetId="ds000001"
          id="ds000001:1.0.0"
          modified={fixedDate}
        />,
        expect(wrapper).toMatchSnapshot(),
      )
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
