import { convertArrayToCSV } from '../csv'

describe('utils/csv', () => {
  it('converts to a valid CSV', () => {
    const obj = [
      { exampleCol: 'test', exampleCol2: 'test2', __typename: 'example' },
      { exampleCol: 'test4', exampleCol2: 'test3', __typename: 'example' },
    ]
    expect(convertArrayToCSV(obj)).toEqual(
      'exampleCol,exampleCol2\n"test","test2"\n"test4","test3"',
    )
  })
  it('escapes comma values correctly', () => {
    const obj = [
      { exampleCol: 'test', modalities: 'PET,MRI', __typename: 'example' },
      { exampleCol: 'test4', modalities: 'MRI', __typename: 'example' },
    ]
    expect(convertArrayToCSV(obj)).toEqual(
      'exampleCol,modalities\n"test","PET,MRI"\n"test4","MRI"',
    )
  })
})
