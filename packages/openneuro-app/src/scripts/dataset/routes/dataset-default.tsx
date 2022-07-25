import React from 'react'
import Markdown from 'markdown-to-jsx'
import { ReadMore } from '@openneuro/components/read-more'
import { MetaDataBlock } from '@openneuro/components/dataset'
import Files from '../files/files'
import Comments from '../comments/comments'
import EditDescriptionField from '../fragments/edit-description-field'

/**
 * Default tab for dataset draft pages
 */
export const DatasetDefault = ({ dataset, hasEdit }) => (
  <>
    <Files
      datasetId={dataset.id}
      snapshotTag={null}
      datasetName={dataset.draft.description.Name}
      files={dataset.draft.files}
      editMode={hasEdit}
      datasetPermissions={dataset.permissions}
    />
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
          editMode={hasEdit}>
          <ReadMore
            id="readme"
            expandLabel="Read More"
            collapseLabel="Collapse">
            <Markdown>{dataset.draft.readme || 'N/A'}</Markdown>
          </ReadMore>
        </EditDescriptionField>
      )}
    />
    <Comments
      datasetId={dataset.id}
      uploader={dataset.uploader}
      comments={dataset.comments}
    />
  </>
)
