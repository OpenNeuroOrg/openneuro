import React, { FC, useContext } from 'react'
import { SearchParamsCtx } from '../search-params-ctx'
import { RadioGroup } from '@openneuro/components/radio'
import { FacetSelect } from '@openneuro/components/facets'
import { useCookies } from 'react-cookie'
import { useLocation, useHistory } from 'react-router-dom'
import { getUnexpiredProfile } from '../../authentication/profile'
import { AccordionTab, AccordionWrap } from '@openneuro/components/accordion'

const ShowDatasetsRadios: FC = () => {
  const [cookies] = useCookies()
  const loggedOut = !getUnexpiredProfile(cookies)
  const location = useLocation()
  const history = useHistory()

  const { searchParams, setSearchParams } = useContext(SearchParamsCtx)

  const {
    datasetType_available,
    datasetType_selected,
    datasetStatus_available,
    datasetStatus_selected,
  } = searchParams
  const setShowSelected = datasetType_selected => {
    const query = new URLSearchParams(location.search)
    if (datasetType_selected === 'My Datasets') {
      if (!query.has('mydatasets')) {
        query.set('mydatasets', 'true')
        history.replace(`${location.pathname}?${query.toString()}`)
      }
    } else {
      if (query.has('mydatasets')) {
        query.delete('mydatasets')
        history.replace(`${location.pathname}?${query.toString()}`)
      }
    }
    setSearchParams(prevState => ({
      ...prevState,
      datasetType_selected,
    }))
  }
  const setShowMyUploadsSelected = datasetStatus_selected =>
    setSearchParams(prevState => ({
      ...prevState,
      datasetStatus_selected,
    }))

  return loggedOut ? null : (
    <>
      <div
        className={
          datasetType_selected.replace(/\s/g, '') +
          ' btn-group-wrapper facet-radio'
        }>
        <RadioGroup
          radioArr={datasetType_available}
          layout="btn-group"
          name="show-datasets"
          selected={datasetType_selected}
          setSelected={setShowSelected}
        />
      </div>
      {datasetType_selected == 'My Datasets' ? (
        <AccordionWrap className="modality-facet facet-accordion">
          <AccordionTab
            accordionStyle="plain"
            label="My Datasets Status"
            startOpen={true}>
            <FacetSelect
              selected={datasetStatus_selected}
              setSelected={setShowMyUploadsSelected}
              items={datasetStatus_available}
            />
          </AccordionTab>
        </AccordionWrap>
      ) : null}
    </>
  )
}

export default ShowDatasetsRadios
