import { check } from '../FacetSelect'

describe('FacetSelect component', () => {
  describe('check()', () => {
    it('adds commas to numeric properties', () => {
      expect(check({ data: 1934810581 }, 'data')).toEqual('1,934,810,581')
    })
    it('nested objects to return child object', () => {
      expect(check({ num: 18485, obj: { num: 810591 } }, 'obj')).toEqual({
        num: 810591,
      })
    })
  })
})
