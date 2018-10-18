import React from 'react'
import { shallow } from 'enzyme'
import DownloadLink, {
  downloadUri,
  checkBrowserEnvironment,
  awaitRegistration,
} from '../download-link.jsx'

const defProps = {
  datasetId: 'ds000001',
  snapshotTag: '1.0.0',
}

describe('dataset/download/DownloadLink', () => {
  it('renders successfully', () => {
    const wrapper = shallow(<DownloadLink {...defProps} />)
    expect(wrapper).toMatchSnapshot()
  })
  describe('downloadUri', () => {
    it('returns a draft path if snapshotTag is not defined', () => {
      expect(downloadUri(defProps.datasetId)).toBe(
        'localhost:9876/crn/datasets/ds000001/download',
      )
    })
    it('returns a snapshot path if snapshotTag is defined', () => {
      expect(downloadUri(defProps.datasetId, defProps.snapshotTag)).toBe(
        'localhost:9876/crn/datasets/ds000001/snapshots/1.0.0/download',
      )
    })
  })
  describe('checkBrowserEnvironment', () => {
    it('should throw an error for no service worker', () => {
      const mockWindow = {
        navigator: {},
      }
      expect(() =>
        checkBrowserEnvironment(mockWindow),
      ).toThrowErrorMatchingSnapshot()
    })
    it('should throw an error for no ReadableStream', () => {
      const mockWindow = {
        navigator: { serviceWorker: {} },
      }
      expect(() =>
        checkBrowserEnvironment(mockWindow),
      ).toThrowErrorMatchingSnapshot()
    })
    it('throws no errors if service worker and readable stream are available', () => {
      const mockWindow = {
        navigator: { serviceWorker: () => {} },
        ReadableStream: () => {},
      }
      expect(() => checkBrowserEnvironment(mockWindow)).not.toThrowError()
    })
  })
  describe('awaitRegistration', () => {
    it('calls next if registration is active', async done => {
      const mockRegistration = { active: true }
      return expect(() =>
        awaitRegistration(done, {})(mockRegistration),
      ).not.toThrowError()
    })
    it('waits for worker if installing', async done => {
      const mockWindow = {
        navigator: {
          serviceWorker: {
            // Transition to active state immediately
            addEventListener: jest.fn((state, callback) =>
              callback({ target: { state: 'active' } }),
            ),
            removeEventListener: jest.fn(),
          },
        },
      }
      const mockRegistration = {
        active: false,
        installing: true,
        waiting: false,
      }

      // Passes in done as next()
      return expect(() => {
        awaitRegistration(done, mockWindow)(mockRegistration)
        // Check that listeners were actually used
        expect(
          mockWindow.navigator.serviceWorker.addEventListener,
        ).toHaveBeenCalledTimes(1)
        expect(
          mockWindow.navigator.serviceWorker.removeEventListener,
        ).toHaveBeenCalledTimes(1)
      }).not.toThrowError()
    })
  })
})
