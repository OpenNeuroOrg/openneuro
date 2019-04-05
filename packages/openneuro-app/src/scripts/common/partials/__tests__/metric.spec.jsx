import React from 'react'
import { shallow } from 'enzyme'
import Metric from '../metric.jsx'

describe('Metric component', () => {
  it('renders with common props', () => {
    expect(
      shallow(<Metric type="stars" value={15} display snapshot />),
    ).toMatchSnapshot()
  })
  it('renders for downloads', () => {
    expect(
      shallow(<Metric type="downloads" value={15} display />),
    ).toMatchSnapshot()
  })
  it('renders for followers', () => {
    expect(
      shallow(<Metric type="followers" value={15} display />),
    ).toMatchSnapshot()
  })
  it('renders for views', () => {
    expect(
      shallow(<Metric type="views" value={15} display />),
    ).toMatchSnapshot()
  })
  it('throws an error for unknown types', () => {
    expect(() =>
      shallow(<Metric type="spaghetti" value={15} display />),
    ).toThrowError()
  })
})
