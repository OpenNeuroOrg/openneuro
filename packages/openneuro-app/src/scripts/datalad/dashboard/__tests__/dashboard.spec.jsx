import React from 'react'
import { StaticRouter as Router } from 'react-router-dom'
import { mount, shallow } from 'enzyme'
import { ApolloProvider } from '@apollo/client'
import Dashboard from '../dashboard.jsx'

describe('Dashboard', () => {
  it('my datasets renders successfully', () => {
    const wrapper = mount(
      <ApolloProvider client={{}}>
        <Router initialEntries={['/']}>
          <Dashboard />
        </Router>
      </ApolloProvider>,
    )
    expect(wrapper).toMatchSnapshot()
  })
  it('public dashboard renders successfully', () => {
    expect(shallow(<Dashboard public />)).toMatchSnapshot()
  })
})
