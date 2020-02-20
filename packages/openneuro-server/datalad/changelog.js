import config from '../config.js'
import fetch from 'node-fetch'
import format from 'date-fns/format'
import { addFileString, commitFiles } from './dataset.js'

/**
 * Matches a CPAN changelog version line
 * @param {string} line
 */
export const matchCpanVersion = line => /^(\S+) (\d{4}-\d{2}-\d{2})$/.exec(line)

/**
 * Returns start and end indexes for the version being modified
 * An empty array means no lines found
 * @param {string[]} changeLines
 * @param {string} tag
 */
export const findVersion = (changeLines, tag) => {
  const start = changeLines.findIndex(matchCpanVersion)
  if (start === -1) {
    return []
  } else {
    const linesAfterMatch = changeLines.slice(start + 1)
    const length = linesAfterMatch.findIndex(matchCpanVersion)
    if (changeLines[start].startsWith(tag)) {
      if (length === -1) {
        // End of file before another entry
        return [start, linesAfterMatch.length + 1]
      } else {
        // Lines until next entry
        return [start, length]
      }
    } else {
      // First version didn't match, try again excluding lines we've searched
      return findVersion(changeLines.slice(start + 1), tag).map(
        x => x + start + 1,
      )
    }
  }
}

/**
 * Upsert new entry for CHANGES
 *
 * This prevents a previously common problem where users would
 * write changes for the same snapshot several times
 *
 * @param {string} changelog Original changelog entry
 * @param {string} tag Which tag to add or overwrite
 * @param {string} date YYYY-MM-DD ISO8601 date
 * @param {string[]} changes Plain change lines to splice in
 */
export const spliceChangelog = (changelog, tag, date, changes) => {
  // trimRight to remove the final newline
  // this way we can always add it back after editing
  const changelogLines = changelog ? changelog.trimRight().split(/\r?\n/) : []
  const [start, length] = findVersion(changelogLines, tag)
  const formattedChanges = changes.map(change => `  - ${change}`)
  formattedChanges.unshift(`${tag} ${date}`)
  if (typeof start !== 'undefined' && typeof length !== 'undefined') {
    changelogLines.splice(start, length, ...formattedChanges)
  } else {
    changelogLines.unshift(...formattedChanges)
  }
  return changelogLines.join('\n') + '\n'
}

/**
 * Format a URL to GET or POST to the CHANGES file
 * @param {string} datasetId Accession number string
 * @param {string} revision Git name for the requested ref
 */
export const changesUrl = (datasetId, revision) => {
  return `http://${config.datalad.uri}/datasets/${datasetId}/snapshots/${revision}/files/CHANGES`
}

/**
 * Edit the CHANGES file with a new set of changes and commit to backend
 * @param {string} datasetId
 * @param {string} tag
 * @param {string[]} changes
 */
export const updateChanges = async (datasetId, tag, changes, user) => {
  const currentChangesReq = await fetch(changesUrl(datasetId, 'HEAD'))
  const currentChanges = await currentChangesReq.text()
  const changeLogDate = format(new Date(), 'YYYY-MM-DD')
  const updatedChangelog = spliceChangelog(
    currentChanges,
    tag,
    changeLogDate,
    changes,
  )
  await addFileString(datasetId, 'CHANGES', 'text/plain', updatedChangelog)
  return commitFiles(datasetId, user)
}
