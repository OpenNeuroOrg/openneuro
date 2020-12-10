import React from 'react'
import { mount } from 'enzyme'
import { ApolloProvider } from '@apollo/client'
import UpdateFile from '../update-file.jsx'

describe('UpdateFile mutation', () => {
  it('renders with default props', () => {
    const wrapper = mount(
      <ApolloProvider client={{}}>
        <UpdateFile />
      </ApolloProvider>,
    )
    expect(wrapper).toMatchSnapshot()
  })
})
