import React from 'react'
import Dataset from '../../datalad/dataset/dataset'

const PreRefactorDatasetProps: React.FC = () => {
  import('../../../sass/pre-refactor-with-wrapper-main.scss')
  return (
    <span className="pre-refactor-styles">
      <Dataset />
    </span>
  )
}
export default PreRefactorDatasetProps
