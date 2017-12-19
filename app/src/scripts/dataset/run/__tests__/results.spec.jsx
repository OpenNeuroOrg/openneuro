import React from 'react'
import { shallow } from 'enzyme'
import Results from '../results.jsx'

describe('dataset/run/Results', () => {
  it('should render something', () => {
    const exampleRun = {
      results: [
        {
          type: 'file',
          dirPath: 'avg_brain_size.txt',
          name: 'avg_brain_size.txt',
          path:
            'openneuro.outputs/cf02b5bf17df80d056effadccffd65bd/dcedf0c3-4438-466d-9f85-61c75275b355/avg_brain_size.txt',
        },
      ],
    }
    expect(
      shallow(
        <Results
          run={exampleRun}
          acknowledgements="acknowledge"
          displayFile={jest.fn()}
          toggleFolder={jest.fn()}
        />,
      ),
    ).toMatchSnapshot()
  })
  it('should render nothing when there are no results', () => {
    const noResultsRun = {
      results: [],
    }
    expect(
      shallow(
        <Results
          run={noResultsRun}
          acknowledgements="acknowledge"
          displayFile={jest.fn()}
          toggleFolder={jest.fn()}
        />,
      ).getElement(),
    ).toBe(null)
  })
})
