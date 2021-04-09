import React, { useState } from 'react'
import PropTypes from 'prop-types'
import getYear from 'date-fns/getYear'
import parseISO from 'date-fns/parseISO'
import { CopyToClipboard } from 'react-copy-to-clipboard'

export const formatCitation = (snapshot, style) => {
  const year = getYear(parseISO(snapshot.created))
  const authors = snapshot.description.Authors
    ? snapshot.description.Authors.join(' and ')
    : 'NO AUTHORS FOUND'
  if (style === 'Text') {
    return `${authors} (${year}). ${snapshot.description.Name}. OpenNeuro. [Dataset] doi: ${snapshot.description.DatasetDOI}`
  } else if (style === 'BibTeX') {
    return `@dataset{${snapshot.id},
  author = {${authors}},
  title = {"${snapshot.description.Name}"},
  year = {${year}},
  doi = {${snapshot.description.DatasetDOI}},
  publisher = {OpenNeuro}
}`
  }
}

const DatasetCitation = ({ snapshot }) => {
  const [style, setStyle] = useState('Text')
  const [copied, setCopied] = useState(false)
  const copiedTimeout = () => {
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 3000)
  }
  const citation = formatCitation(snapshot, style)
  return (
    <>
      <div className="description-item">
        <button
          onClick={() => {
            setStyle('Text')
            setCopied(false)
          }}
          className={style === 'Text' ? 'btn active' : 'btn'}>
          Text
        </button>
        <button
          onClick={() => {
            setStyle('BibTeX')
            setCopied(false)
          }}
          className={style === 'BibTeX' ? 'btn active' : 'btn'}>
          BibTeX
        </button>
        <CopyToClipboard
          text={citation}
          onCopy={() => copiedTimeout()}
          className="btn">
          <span className="copy-key">
            <i className="fa fa-link" aria-hidden="true" />{' '}
            {copied ? <span>Copied to clipboard</span> : <span>Copy</span>}
          </span>
        </CopyToClipboard>
        <div className="col-md-12">
          <div className="row">
            <h5>{style === 'BibTeX' ? <pre>{citation}</pre> : citation}</h5>
          </div>
        </div>
      </div>
    </>
  )
}

DatasetCitation.propTypes = {
  snapshot: PropTypes.object,
}

export default DatasetCitation
