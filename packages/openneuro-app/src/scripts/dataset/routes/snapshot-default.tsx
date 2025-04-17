import React from "react"
import { Markdown } from "../../utils/markdown"
import { ReadMore } from "../../components/read-more/ReadMore"
import { MetaDataBlock } from "../components/MetaDataBlock"
import Files from "../files/files"
import Comments from "../comments/comments"
import { CoralEmbed } from "../comments/coral-embed"

/**
 * Default tab for snapshot pages
 */
export const SnapshotDefault = ({ dataset, snapshot }) => (
  <>
    <MetaDataBlock
      heading="README"
      item={
        <ReadMore id="readme" expandLabel="Read More" collapseLabel="Collapse">
          <Markdown>
            {snapshot.readme == null ? "N/A" : snapshot.readme}
          </Markdown>
        </ReadMore>
      }
      className="dataset-readme markdown-body"
    />
    <Files
      datasetId={dataset.id}
      snapshotTag={snapshot.tag}
      datasetName={snapshot.description.Name}
      files={snapshot.files}
      editMode={false}
      datasetPermissions={dataset.permissions}
      summary={snapshot?.summary}
    />
    <CoralEmbed storyID={dataset.id} />
  </>
)
