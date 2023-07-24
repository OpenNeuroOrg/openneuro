import { convertArrayToCSV } from '../csv'

describe('utils/csv', () => {
  it('converts to a valid CSV', () => {
    const obj = [
      { exampleCol: 'test', exampleCol2: 'test2', __typename: 'example' },
      { exampleCol: 'test4', exampleCol2: 'test3', __typename: 'example' },
    ]
    expect(convertArrayToCSV(obj)).toEqual(
      'exampleCol,exampleCol2\ntest,test2\ntest4,test3',
    )
  })
})
