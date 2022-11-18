import event from 'events'
import { gitAnnexRemote, handleGitAnnexMessage } from '../gitAnnexRemote.js'
import { storeKey, retrieveKey, checkKey } from '../transferKey.js'

vi.mock('../transferKey.js', () => {
  return {
    __esModule: true,
    storeKey: vi.fn(() => true),
    retrieveKey: vi.fn(() => true),
    checkKey: vi.fn(() => true),
    removeKey: vi.fn(() => true),
  }
})

const mockState = {
  url: 'https://example.com',
}

describe('gitAnnexRemote protocol implementation', () => {
  describe('gitAnnexRemote() entrypoint', () => {
    it('exits after readline.close()', () => {
      const mockConsoleLog = vi
        .spyOn(console, 'log')
        .mockImplementation(() => {})
      const mockOnce = vi
        .spyOn(event, 'once')
        .mockImplementation(() => Promise.resolve())
      const mockExit = vi
        .spyOn(process, 'exit')
        .mockImplementationOnce(() => {})
      // Test if the entrypoint function succeeds
      gitAnnexRemote()
      //expect(mockOnce).toHaveBeenCalled()
      expect(mockConsoleLog).toHaveBeenCalledWith('VERSION 1')
      // Teardown mocks
      mockOnce.mockReset()
      mockExit.mockReset()
    })
  })
  describe('gitAnnexRemote handler', () => {
    it('accepts EXTENSIONS message', async () => {
      expect(await handleGitAnnexMessage('EXTENSIONS INFO ASYNC')).toEqual(
        'EXTENSIONS',
      )
    })
    it('accepts PREPARE message', async () => {
      expect(await handleGitAnnexMessage('PREPARE')).toEqual('GETCONFIG url')
    })
    it('accepts VALUE message', async () => {
      expect(
        await handleGitAnnexMessage('VALUE https://openneuro.org', {
          url: 'https://openneuro.org',
        }),
      ).toEqual('PREPARE-SUCCESS')
    })
    it('accepts TRANSFER STORE message', async () => {
      expect(
        await handleGitAnnexMessage('TRANSFER STORE key path', mockState),
      ).toEqual('TRANSFER-SUCCESS STORE key')
      expect(storeKey).toHaveBeenCalled()
    })
    it('accepts TRANSFER RETRIEVE message', async () => {
      expect(
        await handleGitAnnexMessage('TRANSFER RETRIEVE key path', mockState),
      ).toEqual('TRANSFER-SUCCESS RETRIEVE key')
      expect(retrieveKey).toHaveBeenCalled()
    })
    it('accepts CHECKPRESENT key message', async () => {
      expect(
        await handleGitAnnexMessage('CHECKPRESENT key', mockState),
      ).toEqual('CHECKPRESENT-SUCCESS key')
      expect(checkKey).toHaveBeenCalled()
    })
    it('accepts INITREMOTE message', async () => {
      expect(await handleGitAnnexMessage('INITREMOTE')).toEqual(
        'INITREMOTE-SUCCESS',
      )
    })
    it('accepts a REMOVE message', async () => {
      expect(await handleGitAnnexMessage('REMOVE key', mockState)).toEqual(
        'REMOVE-SUCCESS key',
      )
    })
    it('any other request should return UNSUPPORTED-REQUEST', async () => {
      expect(await handleGitAnnexMessage('GETCOST')).toEqual(
        'UNSUPPORTED-REQUEST',
      )
    })
  })
})
