import React from 'react'
import { shallow } from 'enzyme'
import DatasetQuery, { getDatasetPage } from '../dataset-query.jsx'

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
})
