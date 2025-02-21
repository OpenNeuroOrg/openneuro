import React from "react"
import brain from "../assets/brain-initiative.jpg"
import nihbibrand from "../assets/nih-bi-brand.png"

export const portalGrantContent = {
  nih: {
    portal: true,
    grant: "nih", // corresponds to values in `modality_available` in (packages/openneuro-app/src/scripts/refactor_2021/search/initial-search-params.tsx)
    className: "search-page-nih",
    portalName: "NIH BRAIN Initiative",
    portalPrimary: (
      <>
        <a href="https://braininitiative.nih.gov/">The BRAIN Initiative®</a>, is
        public-private research initiative with a common goal of accelerating
        the development of innovative neurotechnologies. In 2019, OpenNeuro was
        designated a BRAIN Initiative data archive. The datasets below were
        collected under BRAIN Initiative-sponsored grants.
      </>
    ),
    publicDatasetStat: 100,
    participantsStat: 1100,
    hexBackgroundImage: brain,
    pageBrand: nihbibrand,
    swoopBackgroundColorLight: "rgba(33, 85, 138, 1)",
    swoopBackgroundColorDark: "rgba(155, 211, 221, 1)",
    communityHeader: null,
    communityPrimary: null,
    communitySecondary: null,
  },
}
