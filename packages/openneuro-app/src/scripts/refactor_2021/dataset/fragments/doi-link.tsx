import React from 'react'
import { Link } from 'react-router-dom'

// See https://www.crossref.org/blog/dois-and-matching-regular-expressions/
export const DOIPattern = /^10.\d{4,9}\/[-._;()/:A-Z0-9]+$/i

export const DOILink = ({ DOI }) => {
  if (
    DOI &&
    (DOI.match(DOIPattern) ||
      DOI.startsWith('doi:') ||
      DOI.startsWith('https://doi.org'))
  ) {
    if (DOI.match(DOIPattern)) {
      return <a href={`https://doi.org/${DOI}`}>{`doi:${DOI}`}</a>
    }
    if (DOI.startsWith('doi:') && DOI.slice(4).match(DOIPattern)) {
      return <a href={`https://doi.org/${DOI.slice(4)}`}>{DOI}</a>
    }
    if (DOI.startsWith('https://doi.org/')) {
      return <a href={DOI}>{`doi:${DOI.slice(16)}`}</a>
    }
  } else {
    return (
      <Link to="snapshot">
        Create a new snapshot to obtain a DOI for the snapshot.
      </Link>
    )
  }
}
