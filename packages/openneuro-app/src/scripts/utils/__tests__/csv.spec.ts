import { convertArrayToCSV } from '../csv'

describe('utils/csv', () => {
  it('converts to a valid CSV', () => {
    const obj = [
      { exampleCol: 'test', exampleCol2: 'test2' },
      { exampleCol: 'test4', exampleCol2: 'test3' },
    ]
    expect(convertArrayToCSV(obj)).toBe('fa')
  })
})
