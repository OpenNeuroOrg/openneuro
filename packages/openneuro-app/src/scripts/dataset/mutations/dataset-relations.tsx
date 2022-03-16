import React, { useState } from 'react'
import TextInput from '../fragments/text-input'
import SelectInput from '../fragments/select-input'
import { DOILink, DOIPattern } from '../fragments/doi-link'
import { useQuery, useMutation, gql, useApolloClient } from '@apollo/client'
import styled from '@emotion/styled'
import { Button } from '@openneuro/components/button'

const getDatasetRelations = gql`
  query getDatasetRelations($datasetId: ID!) {
    dataset(id: $datasetId) {
      latestSnapshot {
        tag
        related {
          id
          kind
          relation
          description
        }
      }
    }
  }
`

const createDatasetRelation = gql`
  mutation createDatasetRelation(
    $datasetId: ID!
    $doi: String!
    $description: String!
    $kind: RelatedObjectKind!
    $relation: RelatedObjectRelation!
  ) {
    createRelation(
      datasetId: $datasetId
      doi: $doi
      description: $description
      kind: $kind
      relation: $relation
    ) {
      id
    }
  }
`

const deleteDatasetRelation = gql`
  mutation deleteDatasetRelation($datasetId: ID!, $doi: String!) {
    deleteRelation(datasetId: $datasetId, doi: $doi) {
      id
    }
  }
`

const RightColumn = styled.div({
  maxWidth: '700px',
  float: 'right',
})

const InfoText = styled.p({
  fontWeight: 100,
  textAlign: 'right',
})

const TableContainer = styled.div({
  display: 'grid',
  gridTemplateColumns: '2fr 3fr 1fr',
  textAlign: 'right',
})

const GridItem = styled.div({
  padding: '8px',
})

const InputGroup = styled.div({
  paddingBottom: '8px',
})

export const DatasetRelations = ({ datasetId, hasEdit }) => {
  const [newRelation, setNewRelation] = useState({
    doi: '',
    description: '',
    relation: 'sameAs',
    kind: 'Dataset',
  })
  const { data, loading, refetch } = useQuery(getDatasetRelations, {
    variables: { datasetId },
  })
  const [createRelation] = useMutation(createDatasetRelation, {})
  const client = useApolloClient()
  if (!loading) {
    const related = data?.dataset?.latestSnapshot?.related
    let loadedData
    if (related) {
      loadedData = (
        <TableContainer>
          {related.map(obj => {
            return (
              <React.Fragment key={obj.id}>
                <GridItem>
                  <DOILink DOI={obj.id} datasetId={datasetId} />
                </GridItem>
                <GridItem>{obj.description}</GridItem>
                <GridItem>
                  <button
                    onClick={async () => {
                      await client.mutate({
                        mutation: deleteDatasetRelation,
                        variables: { datasetId, doi: obj.id },
                      })
                      await refetch()
                    }}>
                    Delete
                  </button>
                </GridItem>
              </React.Fragment>
            )
          })}
        </TableContainer>
      )
    } else {
      loadedData = <p>No related DOIs have been added.</p>
    }
    return (
      <RightColumn>
        <InfoText>
          Add a related DOI such as other repositories where this dataset can be
          found. DOI values should be formatted according to the{' '}
          <a href="https://bids-specification.readthedocs.io/en/stable/02-common-principles.html#uniform-resource-indicator">
            BIDS recommended URI format
          </a>
          .
        </InfoText>
        {loadedData}
        {hasEdit && (
          <div>
            <InputGroup>
              <TextInput
                name="DOI"
                label="DOI of papers related to the dataset or linked datasets"
                value={newRelation.doi}
                onChange={(name, value) => {
                  setNewRelation({ ...newRelation, doi: value })
                }}
              />
              <TextInput
                name="Description"
                label="Description"
                value={newRelation.description}
                onChange={(name, value) => {
                  setNewRelation({ ...newRelation, description: value })
                }}
              />
              <SelectInput
                name="Relation"
                label="Relation to this dataset"
                value={newRelation.relation}
                onChange={(name, value) => {
                  setNewRelation({ ...newRelation, relation: value })
                }}
                options={[
                  { value: 'sameAs' },
                  { value: 'source' },
                  { value: 'derivative' },
                ]}
              />
              <SelectInput
                name="Kind"
                label="Kind of related object"
                value={newRelation.kind}
                onChange={(name, value) => {
                  setNewRelation({ ...newRelation, kind: value })
                }}
                options={[{ value: 'Dataset' }, { value: 'Article' }]}
              />
            </InputGroup>
            <Button
              className="btn-modal-action"
              primary={true}
              label="Add DOI Relation"
              size="small"
              type="submit"
              onClick={async e => {
                e.preventDefault()
                await createRelation({
                  variables: { datasetId, ...newRelation },
                })
                await refetch()
              }}
              // Disable if DOI pattern does not match
              disabled={
                !(
                  newRelation.doi.startsWith('doi:') &&
                  DOIPattern.exec(newRelation.doi.slice(4))
                )
              }
            />
          </div>
        )}
      </RightColumn>
    )
  } else {
    return null
  }
}
