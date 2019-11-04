import React from 'react'
import { shallow } from 'enzyme'
import FrontPageTopDatasets, {
  FrontPageTopResult,
} from '../front-page-top-datasets.jsx'

describe('FrontPageTopDatasets', () => {
  it('renders container correctly', () => {
    const wrapper = shallow(<FrontPageTopDatasets />)
    expect(wrapper).toMatchSnapshot()
  })
  describe('FrontPageTopResult', () => {
    it('does not crash with null query results', () => {
      const fakeQuery = Symbol('not a real query')
      const renderFrontPageTopResult = () => {
        shallow(
          FrontPageTopResult(fakeQuery)({
            loading: false,
            error: false,
            data: {},
          }),
        )
      }
      expect(renderFrontPageTopResult).not.toThrowError()
    })
  })
})
