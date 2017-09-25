import React from 'react'
import { shallow } from 'enzyme'
import JobParameters from '../parameters'

describe('dataset/tools/jobs/parameters', () => {
  const onChange = jest.fn()
  const onRestoreDefaults = jest.fn()
  const params = {
    boolean: true,
    participant_label: '01,02',
    another_option: 'some_string_value',
  }
  const metadata = {
    boolean: {
      type: 'checkbox',
      required: false,
      description: 'some kind of checkbox',
    },
    participant_label: {
      type: 'select',
      required: false,
      description: 'job participants',
    },
    another_option: {
      type: 'text',
      required: true,
      description: 'some kind of text option',
    },
  }
  const subjects = ['01', '02']

  it('renders successfully', () => {
    const wrapper = shallow(
      <JobParameters
        parameters={params}
        parametersMetadata={metadata}
        subjects={subjects}
        onChange={onChange}
        onRestoreDefaults={onRestoreDefaults}
      />,
    )
    expect(wrapper).toMatchSnapshot()
  })
  it('renders noscript with no parameters', () => {
    const wrapper = shallow(<JobParameters />)
    expect(wrapper.first().type()).toBe('noscript')
  })
})
