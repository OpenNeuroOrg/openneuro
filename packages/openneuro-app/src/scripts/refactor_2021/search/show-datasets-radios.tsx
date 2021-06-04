import React, { FC, useContext } from 'react'
import { SearchParamsCtx } from './search-params-ctx'
import { FacetRadio, FacetSelect } from '@openneuro/components'

const ShowDatasetsRadios: FC = () => {
  const { searchParams, setSearchParams } = useContext(SearchParamsCtx)

  const {
    show_available,
    show_selected,
    showMyUploads_available,
    showMyUploads_selected,
  } = searchParams
  const setShowSelected = show_selected =>
    setSearchParams(prevState => ({
      ...prevState,
      show_selected,
    }))
  const setShowMyUploadsSelected = showMyUploads_selected =>
    setSearchParams(prevState => ({
      ...prevState,
      showMyUploads_selected,
    }))

  return (
    <>
      <FacetRadio
        radioArr={show_available}
        layout="row"
        name="show-datasets"
        startOpen={true}
        label="Show"
        accordionStyle="plain"
        selected={show_selected}
        setSelected={setShowSelected}
      />
      {show_selected == 'my_uploads' ? (
        <FacetSelect
          selected={showMyUploads_selected}
          setSelected={setShowMyUploadsSelected}
          items={showMyUploads_available}
          accordionStyle="plain"
          label="My Datasets Status"
          startOpen={true}
        />
      ) : null}
    </>
  )
}

export default ShowDatasetsRadios
