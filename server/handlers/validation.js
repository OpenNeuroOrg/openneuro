// dependencies ------------------------------------------------------------

import config from '../config'
import scitran from '../libs/scitran'
import validate from 'bids-validator'

// handlers ----------------------------------------------------------------

/**
 * Validation
 *
 * Handlers for dataset validation.
 */
export default {
  /**
     * Validate
     */
  validate(req, res) {
    // get project id
    let datasetId = req.params.datasetId

    scitran.downloadSymlinkDataset(datasetId, (err, hash) => {
      validate.BIDS(
        config.location + '/persistent/datasets/' + hash,
        {},
        (validation, summary) => {
          scitran.updateProject(
            datasetId,
            {
              metadata: { validation, summary },
            },
            () => {
              scitran.removeTag('projects', datasetId, 'validating', () => {
                if (validation.errors && validation.errors.length > 0) {
                  scitran.addTag('projects', datasetId, 'invalid', () => {
                    res.send({ validation, summary })
                  })
                } else {
                  scitran.removeTag('projects', datasetId, 'invalid', () => {
                    res.send({ validation, summary })
                  })
                }
              })
            },
          )
        },
      )
    })
  },
}
