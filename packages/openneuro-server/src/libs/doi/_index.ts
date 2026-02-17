import config from "../../config"
import { getDataciteYml } from "../../utils/datacite-utils"
import { description } from "../../graphql/resolvers/description"
import * as datalad from "../../datalad/snapshots"
import datacite from '@api/datacite';
import * as Sentry from "@sentry/node"
import { RawDataciteAttributes } from "../../types/datacite"

type DataciteAttrs = datacite.GetDoisIdResponse200['attributes']

export function formatDoi(datasetId: string, tag: string): string {
    let doi = config.doi.prefix + "/openneuro." + datasetId
    if (tag) {
      doi = doi + ".v" + tag
    }
    return doi
}

export async function updateDoi(datasetId: string, tag: string, registerNew: boolean) {
  const dataciteYml = getDataciteYml(datasetId, tag)
  const doi = formatDoi(datasetId, tag)
  const url =
    `https://openneuro.org/datasets/${datasetId}/versions/${tag}`

  // Should these updates be moved into datacite utils by default? 
  const fields = {
    doi: async () => Promise.resolve(formatDoi(datasetId, tag)),
    url: async () => Promise.resolve(`${config.url}/datasets/${datasetId}/versions/${tag}`),
    year: async () => registerNew ? (new Date()).getFullYear() : datalad.getSnapshot(datasetId, tag).then(snapshot => snapshot.created.getFullYear()),
    // how best to get draft title?
    // title: async () => registerNew ? 'noname' : datasetName({id: datasetId, tag}) 
    title: () => Promise.resolve('noname')
  }

  let updated = false
  Object.keys(fields).map(async (key) => {
    if (!Object.hasOwn(dataciteYml, key)) {
      dataciteYml["data"]["attributes"][key] = await fields[key]()
      updated = true
    }
  })

  if (registerNew) {
    // We do not have access to the user here yet.
    // saveDataciteYaml(datasetId, user, dataciteYml)
  }
  
  dataciteYml["data"]["type"] = "dois"
  /*
  datacite.putDoisId(dataciteYml, {'id': doi}).then((response) => {
    return doi
  }).catch((err) => {
    Sentry.captureException(err)
    return
  })
  */
}

function collectDataciteMetadata(datasetId: string, tag: string): DataciteAttrs {
  /*
    Determine if new or existing tag. If new get latest head/revision thats being used to create snapshot
    Not available in current scope:
      dataset_description 
      - title
      license file
      readme file
      year
  const doi = formatDoi(datasetId, tag)
  const url = `https://openneuro.org/datasets/${datasetId}/versions/${tag}`
  const year = datalad.getSnapshot(datasetId, tag).then(snapshot => snapshot ? snapshot.created.getFullYear() : (new Date()).getFullYear())
  let rights = license ? license : ''
  rights = 'License' in dataset_description  ? dataset_description['License'] : rights
  */
  return {
    'types': {
      'resourceTypeGeneral': 'Dataset'
      // Should we put modalities as 'resourceType'?
    },
    'publisher': {
      'name': config.url
      // publisherIdentifier?
    }
  }
}

function verifyDataciteRemote(datasetId: string, tag: string, dataciteYml: DataciteAttrs): boolean {
  const doi = formatDoi(datasetId, tag)
  return datacite.getDoisId({id: doi}).then((response) => {
    let remoteDatacite: DataciteAttrs = response['attributes']
    return deepEquals(remoteDatacite, dataciteYml)
  }).catch((error) => {
    return false
  })
}


async function updateDataciteRemote(datasetId: string, tag: string, dataciteYml: RawDataciteAttributes): boolean {
  const body: datacite.PutDoisIdBodyParam = {
    'data': {
      'attributes': dataciteYml
    }
  }
  const metadata: datacite.PutDoisMetadataParam = {
    'id': formatDoi(datasetId, tag)
  }
  return await datacite.PutDoisId(body, metadata).then(response => true).catch(error => false)
}

function verifyDataciteLocal(datasetId: string, tag: string) {
  const attrsFromDataset = collectDataciteMetadata(datasetId, tag)
  const dataciteYml = getDataciteYml(datasetId, tag)
  return deepEquals(attrsFromDataset, dataciteYml))
  /*
  if (!deepEquals(attrsFromDataset, dataciteYml)) {
    saveDataciteYml(datasetId, tag, attrsFromDataset)
  }
  */
}

function deepEquals<T>(a: T, b: T): boolean {
  if (a === b) return true

  if (a === null || b === null || typeof a !== 'object' || typeof b !== 'object') {
    return false
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false
    for (let i = 0; i < a.length; i++) {
      if (!deepEquals(a[i], b[i])) return false
    }
    return true
  } else if (Array.isArray(a) || Array.isArray(b)) {
    return false
  }

  const aKeys = Object.keys(a) as (keyof T)[]
  const bKeys = Object.keys(b) as (keyof T)[]

  if (aKeys.length !== bKeys.length) {
    return false
  }

  for (const aKey of keysA) {
    if (!(aKey in b) || !deepEquals(a[aKey], b[aKey])) {
      return false
    }
  }

  return true;
}
