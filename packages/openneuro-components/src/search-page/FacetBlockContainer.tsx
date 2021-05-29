import React from 'react'

import { FacetSelect } from '../facets/FacetSelect'
import { FacetRadio } from '../facets/FacetRadio'
import { modalities, showDatasetsRadio } from '../mock-content/facet-content'

export const FacetBlockContainer = () => {
  const [selected, setSelected] = React.useState()
  const [active, setActive] = React.useState(0)
  return (
    <>
      <FacetSelect
        selected={selected}
        setSelected={setSelected}
        items={modalities}
        accordionStyle="plain"
        label="Modalities"
        startOpen={true}
      />
      <FacetSelect
        selected={selected}
        setSelected={setSelected}
        items={modalities}
        accordionStyle="plain"
        label="Modalities"
        startOpen={true}
      />
      <FacetRadio
        radioArr={showDatasetsRadio}
        layout="row"
        name="show-datasets"
        startOpen={false}
        label="Show"
        accordionStyle="plain"
        active={active}
        setActive={setActive}
      />
    </>
  )
}
