import React from 'react'
import { shallow } from 'enzyme'
import Summary from '../dataset-summary.jsx'

const mockSummary = {
  id: 'f187e25d26ed24ab91842499e06c04ba5a35ccec',
  modalities: ['T1w', 'bold'],
  sessions: ['meg', 'mri'],
  subjects: ['01', '02', '03', '04', '05'],
  tasks: ['one-back task', 'balloon analog risk task'],
  size: 3364126408,
  totalFiles: 1359,
}

describe('Dataset/Summary', () => {
  it('displays accurate file count', () => {
    const wrapper = shallow(<Summary summary={mockSummary} />)
    expect(
      wrapper.contains(
        <span>
          <strong> Files: </strong>
          {mockSummary.totalFiles}
        </span>,
      ),
    ).toBe(true)
  })
  it('displays subject count', () => {
    const wrapper = shallow(<Summary summary={mockSummary} />)
    expect(
      wrapper.contains(
        <span>
          <strong> Subjects: </strong>
          {mockSummary.subjects.length}
        </span>,
      ),
    ).toBe(true)
  })
  it('lists all tasks', () => {
    const wrapper = shallow(<Summary summary={mockSummary} />)
    expect(wrapper.contains(mockSummary.tasks.join(', '))).toBe(true)
  })
  it('lists all modalities', () => {
    const wrapper = shallow(<Summary summary={mockSummary} />)
    expect(wrapper.contains(mockSummary.modalities.join(', '))).toBe(true)
  })
  it('minimal version renders', () => {
    const wrapper = shallow(<Summary summary={mockSummary} minimal={true} />)
    expect(
      wrapper
        .find('div.minimal-summary')
        .children()
        .find('div').length,
    ).toBe(6)
  })
})
