/* eslint-env worker */
import * as Comlink from 'comlink'
import validate from 'bids-validator'

/* MOCK VALIDATOR */
// TODO: remove when bid-validator updates are released
validate.BIDS = (files, options, cb) => {
  const issues = { mocks: 'issues' },
    summary = { mocks: 'summary' }
  cb(issues, summary)
}

const asyncValidateBIDS = (files, options) =>
  new Promise(resolve => {
    validate.BIDS(files, options, (issues, summary) =>
      resolve({ issues, summary }),
    )
  })

async function runValidator(files, options, cb) {
  let error, output
  try {
    output = await asyncValidateBIDS(files, options)
  } catch (err) {
    error = err
  }
  cb({ error, output })
}

Comlink.expose(runValidator)

// satisfies linters
export default null
