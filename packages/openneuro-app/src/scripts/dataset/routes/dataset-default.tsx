import React from "react"
import { Markdown } from "../../utils/markdown"
import { ReadMore } from "@openneuro/components/read-more"
import { MetaDataBlock } from "../components/MetaDataBlock"
import Files from "../files/files"
import Comments from "../comments/comments"
import EditDescriptionField from "../fragments/edit-description-field"

/**
 * Default tab for dataset draft pages
 */
export const DatasetDefault = ({ dataset, hasEdit }) => (
  <>
    <MetaDataBlock
      heading="README"
      className="dataset-readme markdown-body"
      item={dataset.draft.readme}
      renderEditor={() => (
        <EditDescriptionField
          datasetId={dataset.id}
          field="readme"
          rows={12}
          description={dataset.draft.readme}
          editMode={hasEdit}
        >
          <ReadMore
            id="readme"
            expandLabel="Read More"
            collapseLabel="Collapse"
          >
            <Markdown>{dataset.draft.readme || "N/A"}</Markdown>
          </ReadMore>
        </EditDescriptionField>
      )}
    />
    <Files
      datasetId={dataset.id}
      snapshotTag={null}
      datasetName={dataset.draft.description.Name}
      files={dataset.draft.files}
      editMode={hasEdit}
      datasetPermissions={dataset.permissions}
      summary={dataset.draft?.summary}
    />
    <Comments
      datasetId={dataset.id}
      uploader={dataset.uploader}
      comments={dataset.comments}
    />
  </>
)
