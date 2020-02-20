/* eslint-disable no-console */
/**
 * Prepopulate Dataset.name field on upgrade
 */
import path from 'path'
import Dataset from '../models/dataset.js'
import { datasetName } from '../graphql/resolvers/dataset.js'

export default {
  id: path.basename(module.filename),
  update: async () => {
    const datasets = await Dataset.find().exec()
    for (const dataset of datasets) {
      await datasetName(dataset).then(name => {
        console.log(`Updating ${dataset.id} with name "${name}"`)
        return Dataset.update({ id: dataset.id }, { $set: { name } }).exec()
      })
    }
  },
}
