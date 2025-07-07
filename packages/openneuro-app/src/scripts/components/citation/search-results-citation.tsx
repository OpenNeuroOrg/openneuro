import React from "react"
import { parseISO } from "date-fns"
import getYear from "date-fns/getYear"
import type { Dataset } from "../../types/user-types"

interface SearchResultsCitationProps {
  dataset: Dataset
}

export const SearchResultsCitation: React.FC<SearchResultsCitationProps> = ({
  dataset,
}) => {
  // --- AUTHORS FORMATTING ---
  const rawAuthors = dataset.latestSnapshot?.description?.Authors
  let formattedAuthors = "NO AUTHORS FOUND"
  if (rawAuthors && rawAuthors.length > 0) {
    if (rawAuthors.length <= 4) {
      // Pre-Limit
      // Join with commas, with "and" before the last author
      if (rawAuthors.length === 1) {
        formattedAuthors = rawAuthors[0]
      } else if (rawAuthors.length === 2) {
        formattedAuthors = `${rawAuthors[0]} and ${rawAuthors[1]}`
      } else {
        const lastAuthor = rawAuthors[rawAuthors.length - 1]
        const remainingAuthors = rawAuthors.slice(0, rawAuthors.length - 1)
        formattedAuthors = `${remainingAuthors.join(", ")}, and ${lastAuthor}`
      }
    } else {
      // Limit to 4 authors and add "et al."
      const limitedAuthors = rawAuthors.slice(0, 4)
      formattedAuthors = `${limitedAuthors.join(", ")}, et al.`
    }
  }

  const year = dataset.created ? getYear(parseISO(dataset.created)) : "N/A"
  const datasetName = dataset.latestSnapshot?.description?.Name ||
    "NO DATASET NAME FOUND"
  const datasetDOI = dataset.latestSnapshot?.description?.DatasetDOI

  const datasetCite =
    `${formattedAuthors} (${year}). ${datasetName}. OpenNeuro. [Dataset] doi: ${
      datasetDOI ? `${datasetDOI}` : "N/A"
    }`

  return <cite>{datasetCite}</cite>
}

export default SearchResultsCitation
