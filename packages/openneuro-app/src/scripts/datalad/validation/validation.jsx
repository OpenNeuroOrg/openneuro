import React from 'react'
import ValidationQuery from './validation-query.jsx'

const Validation = ({ datasetId }) => (
  <div className="fade-in col-xs-12 validation">
    <h3 className="metaheader">BIDS Validation</h3>
    <ValidationQuery datasetId={datasetId} />
  </div>
)

export default Validation
