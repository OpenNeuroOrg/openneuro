import React from 'react'
import Dataset from '../../datalad/dataset/dataset'
import '../../../sass/pre-refactor-with-wrapper-main.scss'

const PreRefactorDatasetProps: React.FC = () => {
  return (
    <span className="pre-refactor-styles">
      <Dataset />
    </span>
  )
}
export default PreRefactorDatasetProps
