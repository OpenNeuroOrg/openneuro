import React from "react"
import type { FC } from "react"

import { SingleContributorDisplay } from "./contributor"
import type { Contributor } from "../types/datacite"

interface ContributorsListDisplayProps {
  contributors: Contributor[] | null | undefined
  separator?: React.ReactNode
}

/**
 * displays a list of contributors with optional ORCID links and icons.
 * It maps over the contributors and renders a SingleContributorsDisplay for each.
 */
export const ContributorsListDisplay: FC<ContributorsListDisplayProps> = ({
  contributors,
  separator = <br />,
}) => {
  if (!contributors || contributors.length === 0) {
    return <>N/A</>
  }

  return (
    <>
      {contributors.map((contributor, index) => (
        <SingleContributorDisplay
          key={index}
          contributor={contributor}
          isLast={index === contributors.length - 1}
          separator={separator}
        />
      ))}
    </>
  )
}
