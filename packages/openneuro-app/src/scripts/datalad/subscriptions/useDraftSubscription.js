import { useSubscription } from 'react-apollo'
import gql from 'graphql-tag'
import { datasetCacheId } from '../mutations/cache-id.js'
import {
  DRAFT_FRAGMENT,
  DATASET_ISSUES,
} from '../dataset/dataset-query-fragments.js'

const DRAFT_SUBSCRIPTION = gql`
  subscription draftUpdated($datasetIds: [ID!]) {
    draftUpdated(datasetIds: $datasetIds) {
      id
      ...DatasetDraft
      ...DatasetIssues
    }
  }
  ${DRAFT_FRAGMENT}
  ${DATASET_ISSUES}
`

const useDraftSubscription = (client, datasetId) => {
  // console.log('START useDraftSubscription')
  // console.log({useSubscription, datasetId, DRAFT_SUBSCRIPTION, datasetCacheId: datasetCacheId(datasetId) })
  const { data, error, loading } = useSubscription(DRAFT_SUBSCRIPTION, {
    variables: { datasetIds: [datasetId] },
    shouldResubscribe: true,
  })
  console.log('GET subscription update')
  const { draft } = client.readFragment({
    id: datasetCacheId(datasetId),
    fragment: DRAFT_FRAGMENT,
  })

  const updatedDraft = data && data.draftUpdated && data.draftUpdated.draft
  if (updatedDraft) {
    console.log({ description: updatedDraft.description })
    client.writeFragment({
      id: datasetCacheId(datasetId),
      fragment: DRAFT_FRAGMENT,
      data: {
        __typename: 'Dataset',
        id: datasetId,
        draft: {
          ...draft,
          ...updatedDraft,
        },
      },
    })
  } else console.log('NO DATA YET ========================')
}
// const useDraftSubscription = (client, datasetId) => {
//   // console.log('START useDraftSubscription')
//   // console.log({useSubscription, datasetId, DRAFT_SUBSCRIPTION, datasetCacheId: datasetCacheId(datasetId) })
//   const { data, error, loading } = useSubscription(
//     DRAFT_SUBSCRIPTION,
//     {
//       variables: { datasetIds: [datasetId] },
//       shouldResubscribe: true,
//     },
//   )
//   console.log('GET subscription update')
//   const { draft } = client.cache.readFragment({
//     id: datasetCacheId(datasetId),
//     fragment: DRAFT_FRAGMENT,
//   })
//   const test = () => client.cache.readFragment({
//     id: draftCacheId(draft.id),
//     fragment: DRAFT_FIELDS_FRAGMENT,
//   })
//   console.log({client, draft, test: test(), data, error, loading})
//   if (data) {
//     console.log({test: test(), writeFragment: {
//       id: draftCacheId(draft.id),
//       fragment: DRAFT_FIELDS_FRAGMENT,
//       data: data.draftUpdated && data.draftUpdated.draft,
//     }})
//     // client.writeFragment({
//     //   id: draftCacheId(draft.id),
//     //   fragment: DRAFT_FIELDS_FRAGMENT,
//     //   data: data.draftUpdated && data.draftUpdated.draft,
//     // })
//   }
//   else console.log('NO DATA YET ========================')
// }

export default useDraftSubscription
