import counter from '../counter'

/**
 * Returns the next accession number string
 */
export const getAccessionNumber = () => {
  new Promise(resolve => {
    counter.getNext('datasets', datasetNumber => {
      const offset = 1000
      datasetNumber += offset
      resolve('ds' + ('000000' + datasetNumber).substr(-6, 6))
    })
  })
}
