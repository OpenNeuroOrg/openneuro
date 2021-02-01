import React from 'react'
import { mount } from 'enzyme'
import { ApolloProvider } from '@apollo/client'
import Exports from '../../datalad/routes/admin-exports.jsx'

describe('Dashboard', () => {
  it('my datasets renders successfully', () => {
    const wrapper = mount(
      <ApolloProvider client={{}}>
        <Exports />
      </ApolloProvider>,
    )
    expect(wrapper).toMatchSnapshot()
  })
})
