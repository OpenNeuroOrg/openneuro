import React from 'react'
import PropTypes from 'prop-types'
import { Panel, PanelGroup } from 'react-bootstrap'
import UploadResume from '../../uploader/upload-resume.jsx'

const IncompleteDataset = ({ datasetId, issues }) => (
  <div className="fade-in col-xs-12 validation">
    <h3 className="metaheader">Incomplete Upload or Edit</h3>
    <PanelGroup accordion className="validation-wrap">
      <Panel className="status">
        <p>An upload or edit may have been interrupted.</p>
        <UploadResume datasetId={datasetId} />
      </Panel>
    </PanelGroup>
  </div>
)

IncompleteDataset.propTypes = {
  datasetId: PropTypes.string,
}

export default IncompleteDataset
