import React, { FC, useContext, useEffect } from 'react'
import { gql, useQuery } from '@apollo/client'
import { SearchResultsList, Button } from '@openneuro/components'
import { SearchParamsCtx } from './search-params-ctx'

const searchQuery = gql`
  query searchDatasets($q: String!, $cursor: String) {
    datasets: search(q: $q, first: 25, after: $cursor) {
      edges {
        node {
          id
          created
          uploader {
            id
            name
          }
          public
          permissions {
            id
            userPermissions {
              userId
              level
              access: level
              user {
                id
                name
                email
                provider
              }
            }
          }
          draft {
            id
            summary {
              modalities
              sessions
              subjects
              subjectMetadata {
                participantId
                age
                sex
                group
              }
              tasks
              size
              totalFiles
              dataProcessed
            }
            issues {
              severity
            }
            description {
              Name
            }
          }
          analytics {
            views
            downloads
          }
          stars {
            userId
            datasetId
          }
          followers {
            userId
            datasetId
          }
          snapshots {
            id
            created
            tag
          }
        }
      }
      pageInfo {
        startCursor
        endCursor
        hasPreviousPage
        hasNextPage
        count
      }
    }
  }
`

const joinWithAND = (list: string[]) =>
  list.map(str => `(${str})`).join(' AND ')
const isActiveRange = range =>
  JSON.stringify(range) !== JSON.stringify([null, null])
const range = ([min, max]) =>
  `[${min === null ? '*' : min} TO ${max === null ? '*' : max}]`

export const useSearchResults = () => {
  const { searchParams, setSearchParams } = useContext(SearchParamsCtx)
  const {
    keywords,
    datasetType_selected,
    datasetStatus_selected,
    modality_selected,
    ageRange,
    subjectCountRange,
    diagnosis_selected,
    tasks,
    authors,
    gender_selected,
    datePublicizedRange,
    species_selected,
    section_selected,
    studyDomain_selected,
    sortBy_selected,
  } = searchParams

  const qStrings = []
  if (keywords.length) qStrings.push(joinWithAND(keywords))
  if (datasetType_selected) {
  } // TODO: gql resolver level
  if (datasetStatus_selected) {
  } // TODO: gql resolver level
  if (modality_selected)
    qStrings.push(`metadata.modalities: ${modality_selected}`)
  if (isActiveRange(ageRange))
    qStrings.push(`metadata.ages: ${range(ageRange)}`)
  if (isActiveRange(subjectCountRange)) {
  } // TODO: https://discuss.elastic.co/t/painless-check-length-field-in-each-object-of-array/161699
  if (diagnosis_selected)
    qStrings.push(`metadata.dsStatus: ${diagnosis_selected}`)
  if (tasks.length)
    qStrings.push(`latestSnapshot.summary.tasks: ${joinWithAND(tasks)}`)
  if (authors.length)
    qStrings.push(`metadata.seniorAuthor: ${joinWithAND(authors)}`)
  if (gender_selected)
    qStrings.push(
      `latestSnapshot.summary.subjectMetadata.sex: ${gender_selected}`,
    )
  if (datePublicizedRange) qStrings.push(`created:${datePublicizedRange}`)
  if (species_selected) qStrings.push(`metadata.species: ${species_selected}`)
  if (section_selected)
    qStrings.push(`metadata.studyLongitudinal: ${section_selected}`)
  if (studyDomain_selected)
    qStrings.push(`metadata.studyDomain: ${species_selected}`)

  // qStrings.push('id: (ds001120) OR (ds001113)')

  const qString = joinWithAND(qStrings)
  console.log(qString)

  return useQuery(searchQuery, {
    variables: {
      q: qString,
    },
    errorPolicy: 'ignore',
  })
}
