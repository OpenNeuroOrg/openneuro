import React from "react"
import type { FC } from "react"

import { SingleContributorDisplay } from "./single-contributor"
import type { Contributor } from "../../scripts/types/contributors"

interface ContributorListDisplayProps {
  contributors: Contributor[] | null | undefined
  separator?: React.ReactNode
}

/**
 * displays a list of contributors with optional ORCID links and icons.
 * It maps over the contributors and renders a SingleContributorDisplay for each.
 */
export const ContributorListDisplay: FC<ContributorListDisplayProps> = ({
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
