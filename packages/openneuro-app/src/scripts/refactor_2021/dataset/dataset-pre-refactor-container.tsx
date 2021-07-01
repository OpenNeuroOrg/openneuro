import React, { Suspense, lazy } from 'react'
import Dataset from '../../datalad/dataset/dataset'

const PreRefactorMainStyles = lazy(
  () => import('../../../sass/PreRefactorMainStyles'),
)

const PreRefactorDatasetProps: React.FC = () => {
  return (
    <span className="pre-refactor-styles">
      <Suspense fallback={<></>}>{<PreRefactorMainStyles />}</Suspense>
      <Dataset />
    </span>
  )
}
export default PreRefactorDatasetProps
