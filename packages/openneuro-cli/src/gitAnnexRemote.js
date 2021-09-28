import readline from 'readline'
import { once } from 'events'
import { getRepoToken } from './gitCredential.js'
import { storeKey, retrieveKey, checkKey, removeKey } from './transferKey.js'

const GIT_ANNEX_VERSION = 'VERSION 1'

export async function handleGitAnnexMessage(line, state) {
  if (line.startsWith('EXTENSIONS')) {
    return 'EXTENSIONS'
  } else if (line.startsWith('PREPARE')) {
    // Ask for configuration to validate
    return 'GETCONFIG url'
  } else if (line.startsWith('VALUE ')) {
    // Check if VALUE is configured already
    if (state.url) {
      return 'PREPARE-SUCCESS'
    } else {
      return 'PREPARE-FAILURE url must be configured when running initremote or enableremote'
    }
  } else if (line.startsWith('TRANSFER STORE')) {
    const [, , key, file] = line.split(' ', 4)
    if (await storeKey(state, key, file)) {
      return `TRANSFER-SUCCESS STORE ${key}`
    } else {
      return `TRANSFER-FAILURE STORE ${key}`
    }
  } else if (line.startsWith('TRANSFER RETRIEVE')) {
    const [, , key, file] = line.split(' ', 4)
    if (await retrieveKey(state, key, file)) {
      return `TRANSFER-SUCCESS RETRIEVE ${key}`
    } else {
      return `TRANSFER-FAILURE RETRIEVE ${key}`
    }
  } else if (line.startsWith('CHECKPRESENT')) {
    const key = line.split('CHECKPRESENT ', 2)[1]
    if (await checkKey(state, key)) {
      return `CHECKPRESENT-SUCCESS ${key}`
    } else {
      return `CHECKPRESENT-FAILURE ${key}`
    }
  } else if (line.startsWith('INITREMOTE')) {
    // No init steps are required - always succeed
    return 'INITREMOTE-SUCCESS'
  } else if (line.startsWith('GETAVAILABILITY')) {
    return 'AVAILABILITY GLOBAL'
  } else if (line.startsWith('REMOVE')) {
    const key = line.split('REMOVE ', 2)[1]
    if (await removeKey(state, key)) {
      return `REMOVE-SUCCESS ${key}`
    } else {
      return `REMOVE-FAILURE ${key}`
    }
  } else {
    return 'UNSUPPORTED-REQUEST'
  }
}

/**
 * Stateful response handling for git annex protocol
 * @returns {() => void}
 */
export const response = () => {
  const state = {}
  return async line => {
    if (line.startsWith('VALUE ')) {
      try {
        const url = line.split('VALUE ')[1]
        // Obtain the filename (no extensions) in url value
        const datasetId = url.substring(url.lastIndexOf('/') + 1, url.length)
        state.url = url
        state.token = await getRepoToken(datasetId)
      } catch (err) {
        state.url = undefined
        state.token = undefined
      }
    }
    console.log(await handleGitAnnexMessage(line, state))
  }
}

export async function gitAnnexRemote() {
  try {
    const rl = readline.createInterface({
      input: process.stdin,
    })
    console.log(GIT_ANNEX_VERSION)
    rl.on('line', response())
    await once(rl, 'close')
    process.exit(0)
  } catch (err) {
    console.error(err)
  }
}
