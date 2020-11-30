import React, { useState } from 'react'
import format from 'date-fns/format'
import getYear from 'date-fns/getYear'
import parseISO from 'date-fns/parseISO'
import CopyableTooltip from '../../datalad/fragments/copyable-tooltip.jsx'

const formatCitation = (datasetId, snapshot, style) => {
  const year = getYear(parseISO(snapshot.created))
  const today = format(new Date(), 'dd MMM yyyy')
  if (style === 'APA') {
    return `${snapshot.description.Authors.join(' and ')} (${year}). ${
      snapshot.description.Name
    }. ${snapshot.tag}. OpenNeuro. Dataset. doi: ${
      snapshot.description.DatasetDOI
    }`
  } else if (style === 'MLA') {
    return `${snapshot.description.Authors.join(' and ')}. ${
      snapshot.description.Name
    } (${snapshot.tag}) OpenNeuro, ${year}. Web. ${today} doi: ${
      snapshot.description.DatasetDOI
    }`
  } else if (style === 'Chicago') {
    return ''
  } else if (style === 'BibTeX') {
    return `@dataset{${snapshot.id},
  author = {${snapshot.description.Authors.join(' and ')}},
  title = {"${snapshot.description.Name}"},
  year = {${year}},
  doi = {${snapshot.description.DatasetDOI}},
  publisher = {OpenNeuro}
}`
  }
}

const DatasetCitation = ({ datasetId, snapshot }) => {
  const [style, setStyle] = useState('APA')
  const citation = formatCitation(datasetId, snapshot, style)
  return (
    <>
      <div className="col-md-6">
        <span>Style: </span>
        <button onClick={() => setStyle('APA')}>APA</button>
        <button onClick={() => setStyle('MLA')}>MLA</button>
        <button onClick={() => setStyle('Chicago')}>Chicago</button>
        <button onClick={() => setStyle('BibTeX')}>BibTeX</button>
      </div>
      {style === 'BibTeX' ? <pre>{citation}</pre> : citation}
      <CopyableTooltip text={''} tip={citation} />
    </>
  )
}

export default DatasetCitation
