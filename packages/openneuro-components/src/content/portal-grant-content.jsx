import React from "react"
import brain from "../assets/brain-initiative.jpg"
import nihbibrand from "../assets/nih-bi-brand.png"

export const portalGrantContent = {
  nih: {
    grant: "nih", // corresponds to values in `modality_available` in (packages/openneuro-app/src/scripts/refactor_2021/search/initial-search-params.tsx)
    className: "search-page-nih",
    portalName: "NIH Brain Initiative",
    portalPrimary: (
      <>
        The Brain Research Through Advancing Innovative Neurotechnologies®
        Initiative, or{" "}
        <a href="https://braininitiative.nih.gov/">The BRAIN Initiative®</a>, is
        a partnership between Federal and non-Federal partners with a common
        goal of accelerating the development of innovative neurotechnologies.
        Through the application and dissemination of these scientific
        advancements, researchers will be able to produce a revolutionary new
        dynamic picture of the brain that, for the first time, shows how
        individual cells and complex neural circuits interact in both time and
        space.
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
