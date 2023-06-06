import React, { FC } from 'react'

import { DeleteReviewerLink } from '../mutations/delete-anonymous-reviewer'
import { CreateReviewLink } from '../mutations/create-anonymous-reviewer'
import { HeaderRow4 } from './styles/header-row'

const formatDate = dateObject =>
  new Date(dateObject).toISOString().split('T')[0]

interface AnonymousReviewerProps {
  datasetId: string
  reviewers: {
    id: string
    expiration: Date
  }[]
  hasSnapshot: boolean
}

export const AnonymousReviewer: FC<AnonymousReviewerProps> = ({
  datasetId,
  reviewers,
  hasSnapshot,
}) => {
  return (
    <div className="dataset-anonymous-form">
      <div className="dataset-form-header">
        <div className="form-group">
          <HeaderRow4>Create Anonymous Reviewer Link</HeaderRow4>
          <p>
            Create an anonymous review link to share this dataset for anonymous
            access. A review user has read only access and tokens are valid for
            one year or until they are removed.
          </p>
        </div>
        {hasSnapshot ? (
          <CreateReviewLink datasetId={datasetId} />
        ) : (
          <p className="text-danger">
            Please create a dataset version before generating a reviewer link.
          </p>
        )}
        {reviewers.length ? (
          <div className="dataset-form-body">
            <h3>Previous Review Links: </h3>
            <div className="data-table-header">
              <span>ID</span>
              <span>Expiration</span>
              <span>Edit</span>
            </div>
            {reviewers?.map((item, index) => (
              <div key={index} className="data-table-content">
                <span>
                  <label>ID: </label> {item.id}
                </span>
                <span>
                  <label>Expiration: </label> {formatDate(item.expiration)}
                </span>
                <span>
                  <DeleteReviewerLink datasetId={datasetId} id={item.id} />
                </span>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default AnonymousReviewer
