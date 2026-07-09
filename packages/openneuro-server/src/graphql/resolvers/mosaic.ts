import config from "../../config"
import { generateDataladCookie } from "../../libs/authentication/jwt"
import { getDatasetWorker } from "../../libs/datalad-service"
import Mosaic from "../../models/mosaic"
import { getRedis } from "../../libs/redis"
import CacheItem from "../../cache/item"
import { CacheType } from "../../cache/types"
import type { GraphQLContext } from "../builder"


export const mosaic = async (dataset, _, _context: GraphQLContext) => {
  const cache = new CacheItem(
    getRedis(),
    CacheType.mosaic,
    [dataset.id, dataset.revision],
  )
  const cacheResult = await cache.get((doNotCache) => {
    return Mosaic.findOne({
      id: dataset.revision,
      datasetId: dataset.id,
    })
      .exec()
      .then((data) => {
        if (data) {
          return true
        } else {
          doNotCache(true)
          return false
        }
      })
  })
  return cacheResult
}

/**
 * Snapshot mosaic resolver
 */
export const snapshotMosaic = async (snapshot, _, context: GraphQLContext) => {
  const dataset = {
    id: snapshot.id.split(":")[0],
    revision: snapshot.hexsha,
  }
  return mosaic(dataset, _, context)
}

/**
 * Save mosaic data returned by the datalad service
 *
 * Returns only a boolean if successful or not
 */
export const updateMosaic = (obj, args) => {
  return Mosaic.updateOne(
    {
      id: args.mosaic.id,
      datasetId: args.mosaic.datasetId,
    },
    args.mosaic,
    {
      upsert: true,
    },
  )
    .exec()
    .then(() => true)
}

export const mosaicUrl = (datasetId, ref) => {
  return `http://${
    getDatasetWorker(
      datasetId,
    )
  }/datasets/${datasetId}/mosaic/${ref}`
}

/**
 * Request mosaic creation for a given commit
 * @param {object} obj Parent resolver
 * @param {object} args
 * @param {string} args.datasetId Dataset accession number
 * @param {string} args.ref Git hexsha
 */
export const createMosaic = async (obj, { datasetId, ref }, { userInfo }: Pick<GraphQLContext, "userInfo">) => {
  try {
    const response = await fetch(mosaicUrl(datasetId, ref), {
      method: "POST",
      body: JSON.stringify({}),
      headers: {
        cookie: generateDataladCookie(config)(userInfo),
      },
    })
    if (response.status === 200) {
      return true
    } else {
      return false
    }
  } catch (err) {
    // Backend unavailable or lock failed
    if (err) {
      return false
    }
  }
}
