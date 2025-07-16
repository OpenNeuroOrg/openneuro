import React from "react"
import type { FC } from "react"

import { SingleCreatorDisplay } from "./creator"
import type { Creator } from "../types/creators"

interface CreatorListDisplayProps {
  creators: Creator[] | null | undefined
  separator?: React.ReactNode
}

/**
 * displays a list of creators with optional ORCID links and icons.
 * It maps over the creators and renders a SingleCreatorDisplay for each.
 */
export const CreatorListDisplay: FC<CreatorListDisplayProps> = ({
  creators,
  separator = <br />,
}) => {
  if (!creators || creators.length === 0) {
    return <>N/A</>
  }

  return (
    <>
      {creators.map((creator, index) => (
        <SingleCreatorDisplay
          key={index}
          creator={creator}
          isLast={index === creators.length - 1}
          separator={separator}
        />
      ))}
    </>
  )
}
