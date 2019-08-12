import { participantCount } from '../participant-count'

describe('DatasetCount', () => {
  describe('ParticipantCountDisplay', () => {
    it('returns null if loading', () => {
      const count = participantCount({
        loading: true,
        data: {
          participantCount: 10
        }
      })
      expect(count).toBeNull()
    })
    it('returns null when no data', () => {
      const count = participantCount({
        loading: false,
        data: undefined
      })
      expect(count).toBeNull()
    })
    it('returns the participantCount when provided', () => {
      const count = participantCount({
        loading: false,
        data: {
          participantCount: 10
        }
      })
      expect(count).toBe(10)
    })
  })
})
