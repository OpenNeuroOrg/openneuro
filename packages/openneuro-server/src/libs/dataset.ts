import { getNext } from "./counter"

/**
 * Returns the next accession number string
 */
export async function getAccessionNumber() {
  const datasetNumber = (await getNext("datasets")) + 1000
  return `ds${("000000" + datasetNumber).substr(-6, 6)}`
}
