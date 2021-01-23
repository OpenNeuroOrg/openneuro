import request from 'superagent'
import { getAllDatasetWorkers } from '../libs/datalad-service'

/**
 * Run remote reexporter.
 */
export const runReexporter = async () => {
  const workers = getAllDatasetWorkers()
  await Promise.all(
    workers.map(async worker => {
      const uri = `${worker}/reexport-remotes`
      return request.post(uri)
    }),
  )
}

export const CHECK = 'hi'
