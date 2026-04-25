import React from "react"
import { parseISO } from "date-fns"
import getYear from "date-fns/getYear"
import { authorsCitationList } from "./authors-citation-list"

interface CitationDataset {
  created: string
  latestSnapshot?: {
    description?: {
      Name?: string | null
      Authors?: string[] | null
      DatasetDOI?: string | null
    } | null
  } | null
}

interface SearchResultsCitationProps {
  dataset: CitationDataset
}

export const SearchResultsCitation: React.FC<SearchResultsCitationProps> = ({
  dataset,
}) => {
  const rawAuthors = dataset.latestSnapshot?.description?.Authors?.filter(
    Boolean,
  ) as
    | string[]
    | undefined
  const year = dataset.created ? getYear(parseISO(dataset.created)) : "N/A"
  const datasetName = dataset.latestSnapshot?.description?.Name ||
    "NO DATASET NAME FOUND"
  const datasetDOI = dataset.latestSnapshot?.description?.DatasetDOI

  const datasetCite = `${
    authorsCitationList(rawAuthors, 4)
  } (${year}). ${datasetName}. OpenNeuro. [Dataset] doi: ${
    datasetDOI ? `${datasetDOI}` : "N/A"
  }`

  return (
    <cite>
      {datasetCite}
    </cite>
  )
}

export default SearchResultsCitation
