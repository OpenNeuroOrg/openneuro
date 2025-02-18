import React from "react"
import bidslogo from "../assets/bids.jpg"
import dataladlogo from "../assets/datalad.jpg"
import nihlogo from "../assets/nih-bi-logo.png"

export const affiliateContent = [
  {
    logo: bidslogo,
    header: "Validation Using BIDS",
    contentOne: (
      <>
        The{" "}
        <a href="https://bids.neuroimaging.io/">Brain Imaging Data Structure</a>
        {" "}
        (BIDS) is an emerging standard for the organization of neuroimaging
        data.
      </>
    ),
    contentTwo: (
      <>
        Want to contribute to BIDS?
        <br /> Visit the{" "}
        <a href="https://groups.google.com/g/bids-discussion">
          Google discussion group
        </a>{" "}
        to contribute.
      </>
    ),
  },
  {
    logo: dataladlogo,
    header: "OpenNeuro Runs on DataLad",
    contentOne: (
      <>
        Want to access OpenNeuro datasets with DataLad? Visit the{" "}
        <a href="https://github.com/OpenNeuroDatasets/">
          dataset collection on GitHub
        </a>
        .
      </>
    ),
    contentTwo: (
      <>
        A data management solution built on{" "}
        <a href="https://github.com/">Git</a> and{" "}
        <a href="https://git-annex.branchable.com/">Git-annex</a>. Read more
        about <a href="https://www.datalad.org/">DataLad</a>.
      </>
    ),
  },
  {
    logo: nihlogo,
    header: "The BRAIN Initiative supports OpenNeuro",
    contentOne: (
      <>
        Want to learn more about OpenNeuro and BRAIN Initiative? Visit the{" "}
        <a href="https://braininitiative.nih.gov/">
          initiative page
        </a>
        .
      </>
    ),
    contentTwo: (
      <>
        View the collection of{" "}
        <a href="http://localhost:9876/search/nih?query=%7B%22brain_initiative%22%3A%22true%22%7D">
          BRAIN Initiative datasets
        </a>
      </>
    ),
  },
]
