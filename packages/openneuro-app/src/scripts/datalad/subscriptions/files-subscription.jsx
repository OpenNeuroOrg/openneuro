import React from 'react'
import PropTypes from 'prop-types'
import { Subscription } from 'react-apollo'
import gql from 'graphql-tag'
import { DRAFT_FILES_FRAGMENT } from '../dataset/dataset-query-fragments.js'
import { datasetCacheId } from '../mutations/cache-id.js'
// import { datasetCacheId } from '../mutations/cache-id.js'

const FILES_SUBSCRIPTION = gql`
  subscription filesUpdated($datasetId: ID!) {
    filesUpdated(datasetId: $datasetId) {
      action
      payload {
        id
        filename
        size
      }
    }
  }
`

/**
 * Remove file with given filename from draft
 * @param {Object[]} files - file to be deleted (see DatasetFile schema)
 * @param {Object} draft - current draft in apollo cache
 * @returns {Object} - updated version of draft
 */
export const deleteFilesReducer = (files, draft) => {
  const deleted = files.map(({ filename }) => filename.split(':').join('/'))
  return {
    ...draft,
    files: draft.files.filter(file => !deleted.includes(file.filename)),
  }
}

export const draftReducer = (draft, action, payload) => {
  switch (action) {
    case 'DELETE':
      return deleteFilesReducer(payload, draft)
    default:
      return { ...draft }
  }
}

const FilesSubscription = ({ datasetId }) => (
  <Subscription
    subscription={FILES_SUBSCRIPTION}
    variables={{ datasetId }}
    // onSubscriptionData={({ client, subscriptionData: { data } }) => {
    onSubscriptionData={({ client, subscriptionData }) => {
      const { cache } = client
      const { action, payload } = subscriptionData.data.filesUpdated
      console.log({ action, payload })
      if (action && payload) {
        const id = datasetCacheId(datasetId)
        const { draft } = cache.readFragment({
          id,
          fragment: DRAFT_FILES_FRAGMENT,
        })
        const updatedDraft = draftReducer(draft, action, payload)
        cache.writeFragment({
          id,
          fragment: DRAFT_FILES_FRAGMENT,
          data: {
            __typename: 'Dataset',
            id: datasetId,
            draft: updatedDraft,
          },
        })
      }
    }}
  />
)

FilesSubscription.propTypes = {
  datasetId: PropTypes.string,
}

export default FilesSubscription
