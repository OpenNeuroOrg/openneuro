import React from "react"
import PropTypes from "prop-types"
import DatasetHistory from "../fragments/dataset-history.jsx"
import CacheClear from "../mutations/cache-clear.jsx"
import AdminExports from "../mutations/admin-exports"
import { DatasetPageBorder } from "./styles/dataset-page-border"
import { HeaderRow3, HeaderRow4 } from "./styles/header-row"

const AdminDataset = ({ dataset }) => (
  <DatasetPageBorder className="datalad-dataset-form">
    <HeaderRow3>Site Admin Tools</HeaderRow3>
    <p>
      Delete dataset cache drops this dataset's caches (snapshot index,
      draft/snapshot file listings, current dataset description) and the cache
      is repopulated on the next API call.
    </p>
    <div className="dataset-form-controls">
      <CacheClear datasetId={dataset.id} />
    </div>
    <hr />
    <HeaderRow4>Rerun Exports</HeaderRow4>
    <p>
      Correct most temporary issues with a dataset export by reattempting to
      push to S3 and GitHub.
    </p>
    <div className="dataset-form-controls">
      <AdminExports />
    </div>
    <hr />
    <HeaderRow4>Draft Head</HeaderRow4>
    {dataset.draft.head}
    <DatasetHistory datasetId={dataset.id} />
  </DatasetPageBorder>
)

AdminDataset.propTypes = {
  dataset: PropTypes.object,
}

export default AdminDataset
