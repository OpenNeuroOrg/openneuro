import React from 'react'
import { shallow } from 'enzyme'
import Results from '../results.jsx'

describe('dataset/run/Results', () => {
  it('should render something when the job status is "SUCCEEDED"', () => {
    const successfulRun = {
      results: [
        {
          type: 'file',
          dirPath: 'avg_brain_size.txt',
          name: 'avg_brain_size.txt',
          path:
            'openneuro.outputs/cf02b5bf17df80d056effadccffd65bd/dcedf0c3-4438-466d-9f85-61c75275b355/avg_brain_size.txt',
        },
      ],
      analysis: {
        status: 'SUCCEEDED',
      },
    }
    expect(
      shallow(
        <Results
          run={successfulRun}
          acknowledgements="acknowledge"
          displayFile={jest.fn()}
          toggleFolder={jest.fn()}
        />,
      ),
    ).toMatchSnapshot()
  })
  it('should render something when the job status is "FAILED"', () => {
    const failedRun = {
      results: [
        {
          type: 'file',
          dirPath: 'avg_brain_size.txt',
          name: 'avg_brain_size.txt',
          path:
            'openneuro.outputs/cf02b5bf17df80d056effadccffd65bd/dcedf0c3-4438-466d-9f85-61c75275b355/avg_brain_size.txt',
        },
      ],
      analysis: {
        status: 'FAILED',
      },
    }
    expect(
      shallow(
        <Results
          run={failedRun}
          acknowledgements="acknowledge"
          displayFile={jest.fn()}
          toggleFolder={jest.fn()}
        />,
      ),
    ).toMatchSnapshot()
  })
  it('should render nothing when job status is neither "SUCCEEDED" nor "FAILED"', () => {
    const noResultsRun = {
      results: [],
      analysis: {
        status: 'RUNNING',
      },
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
