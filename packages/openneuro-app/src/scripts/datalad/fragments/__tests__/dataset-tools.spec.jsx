import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { render } from '@testing-library/react'
import DatasetTools from '../dataset-tools.jsx'

describe('DatasetTools component', () => {
  it('renders tools with common props', () => {
    const wrapper = render(
      <MemoryRouter initialEntries={[`/datasets/ds000113`]}>
        <DatasetTools
          dataset={{
            id: 'ds001',
            public: false,
            following: true,
            starred: false,
            snapshots: [],
          }}
        />
      </MemoryRouter>,
    )
    expect(wrapper).toMatchSnapshot()
  })
  it('renders tools for public datasets', () => {
    const wrapper = render(
      <MemoryRouter initialEntries={[`/datasets/ds000113`]}>
        <DatasetTools
          dataset={{
            id: 'ds001',
            public: true,
            following: true,
            starred: false,
            snapshots: [],
          }}
        />
      </MemoryRouter>,
    )
    expect(wrapper).toMatchSnapshot()
  })
  it('renders tools for public snapshots', () => {
    const wrapper = render(
      <MemoryRouter initialEntries={[`/datasets/ds000113/versions/1.3.0`]}>
        <DatasetTools
          dataset={{
            id: 'ds001',
            public: true,
            following: true,
            starred: false,
            snapshots: [{ id: 'ds000113:1.3.0' }],
          }}
        />
      </MemoryRouter>,
    )
    expect(wrapper).toMatchSnapshot()
  })
})
