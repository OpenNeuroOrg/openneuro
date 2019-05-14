import React from 'react'
import { shallow } from 'enzyme'
import DatasetQuery, {
  getDatasetPage,
  DatasetQueryRender,
} from '../dataset-query.jsx'

describe('DatasetQuery', () => {
  describe('getDatasetPage', () => {
    it('is a valid query', () => {
      expect(getDatasetPage.kind).toBe('Document')
      expect(getDatasetPage.definitions[0].operation).toBe('query')
    })
  })
  describe('component', () => {
    it('renders with common params', () => {
      const wrapper = shallow(
        <DatasetQuery match={{ params: { datasetId: 'ds000001' } }} />,
      )
      expect(wrapper).toMatchSnapshot()
    })
  })
  describe('DatasetQueryRender', () => {
    it('shows a spinner in the loading state', () => {
      const wrapper = shallow(<DatasetQueryRender loading />)
      expect(wrapper.find('Spinner')).toHaveLength(1)
      expect(wrapper.find('DatasetPage')).toHaveLength(0)
    })
    it('shows renders DatasetPage once done', () => {
      const wrapper = shallow(
        <DatasetQueryRender
          loading={false}
          data={{ dataset: { draft: { issues: [] } } }}
        />,
      )
      expect(wrapper.find('Spinner')).toHaveLength(0)
      expect(wrapper.find('DatasetPage')).toHaveLength(1)
    })
  })
})
