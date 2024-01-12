import React, { FC } from "react"
import { gql, useMutation } from "@apollo/client"
import { Link } from "react-router-dom"
import { Tooltip } from "@openneuro/components/tooltip"
import { Button } from "@openneuro/components/button"

const CREATE_LINK = gql`
  mutation createReviewer($datasetId: ID!) {
    createReviewer(datasetId: $datasetId) {
      id
      datasetId
      url
      expiration
    }
  }
`

interface CreateReviewLinkProps {
  datasetId: string
}

export const CreateReviewLink: FC<CreateReviewLinkProps> = ({ datasetId }) => {
  function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
  }

  const [CreateReviewLink, { data, error }] = useMutation(CREATE_LINK)
  return (
    <>
      <div className="share-form-controls">
        {error
          ? (
            "An Error Occurred"
          )
          : data
          ? (
            <div className="reviewer-link">
              <div>
                <Tooltip
                  tooltip="Click to copy URL to clipboard"
                  flow="right"
                  className="tooltip"
                >
                  <Button
                    onClick={() => copyToClipboard(data.createReviewer.url)}
                    icon="fas fa-clipboard"
                    size="small"
                    nobg={true}
                    iconSize="18px"
                    label="copy anonymous URL"
                  />
                </Tooltip>
                <pre>{data.createReviewer.url}</pre>
              </div>
              <small className="alert-color">
                Copy and save this reviewer link. It will disappear when you
                leave the page. To get a new link click the Create Link button
                below.
              </small>
            </div>
          )
          : null}
        <Button
          className="btn-modal-action"
          primary={true}
          label="Create Review Link"
          size="small"
          onClick={() => CreateReviewLink({ variables: { datasetId } })}
        />
      </div>
    </>
  )
}
