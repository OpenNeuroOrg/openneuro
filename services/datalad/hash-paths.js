#!/usr/bin/env node
// Example: ls -1 /datalad | node hash-paths.js 0
const crypto = require('crypto')
const readline = require('readline')
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
})

const matches = []

rl.on('line', function(line) {
  const target = hashDatasetToRange(line, 4)
  if (target === parseInt(process.argv[2])) {
    matches.push(line)
  }
})

rl.on('close', () => {
  console.log(
    `rsync -av --include='${matches.join(
      "**' --include='",
    )}**' --exclude='*' /datalad/ /datasets`,
  )
})

/**
 * Map dataset IDs to a normal distribution of backend workers
 * @param {string} dataset Accession number string - e.g. ds000001
 * @param {number} range Integer bound for offset from hash
 */
function hashDatasetToRange(dataset, range) {
  const hash = crypto.createHash('sha1').update(dataset, 'utf8')
  const hexstring = hash.digest().toString('hex')
  return parseInt(hexstring.substring(32, 40), 16) % range
}
