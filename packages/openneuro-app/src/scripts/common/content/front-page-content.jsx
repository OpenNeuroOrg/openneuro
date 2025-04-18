import React from "react"
import { Link } from "react-router-dom"
import ljaf from "./assets/front-page/ljaf.png"
import nihbi from "./assets/affiliates/nih-bi-logo.png"
import nsf from "./assets/front-page/nsf.png"
import squishymedia from "./assets/front-page/sqm-logo.png"
import novo from "./assets/front-page/novo-logo.png"
import nru from "./assets/front-page/nru-logo.png"
import stanford from "./assets/front-page/stanford.png"
import logo_app from "./assets/front-page/logo_app.png"
import logo_cube from "./assets/front-page/logo_cube.png"
import logo_data from "./assets/front-page/logo_data.png"
import logo_users from "./assets/front-page/logo_users.png"
import brand_mark from "./assets/front-page/brand_mark.png"

import getImage from "./assets/front-page/cube-get.png"
import shareImage from "./assets/front-page/cube-share.png"
import useImage from "./assets/front-page/cube-use.png"

export const frontPage = {
  pageTitle: "OpenNeuro",
  copyright: {
    holder: "Stanford Center for Reproducible Neuroscience",
  },
  pageDescription: (
    <h2>
      A free and open platform for validating and sharing BIDS-compliant{" "}
      <Link to="/search/modality/mri">MRI</Link>,{" "}
      <Link to="/search/modality/pet">PET</Link>,{" "}
      <Link to="/search/modality/meg">MEG</Link>,{" "}
      <Link to="/search/modality/eeg">EEG</Link>, and{" "}
      <Link to="/search/modality/ieeg">iEEG</Link> data
    </h2>
  ),
  titlePanel: {
    logos: [
      {
        class: "logo-layer-users",
        src: logo_users,
        alt: "OpenNeuro Logo",
      },
      {
        class: "logo-layer-cube",
        src: logo_cube,
        alt: "OpenNeuro Logo",
      },
      {
        class: "logo-layer-app",
        src: logo_app,
        alt: "OpenNeuro Logo",
      },
      {
        class: "logo-layer-data",
        src: logo_data,
        alt: "OpenNeuro Logo",
      },
    ],
    logoText: true,
    privacyDetail: "",
    privacyLink: "https://www.stanford.edu/site/privacy/",
  },
  navBar: {
    brand: {
      src: brand_mark,
      alt: "OpenNeuro Logo",
      title: "OpenNeuro Link to Home Page",
      text: {
        first: "Open",
        second: "Neuro",
      },
    },
  },
  frontPageExtras: true,
  collaborators: true,
  infographic: [
    {
      name: "Get Data",
      image: getImage,
      htmlID: "get-data",
      content: (
        <>
          <p>
            Browse and explore public datasets and analyses from a wide range of
            global contributors. Our collection of public datasets continues to
            grow as more and more become BIDS compatible.
          </p>
          <p>
            Download and use public data to create new datasets and run your own
            analyses.
          </p>
        </>
      ),
    },
    {
      name: "Share Data",
      image: shareImage,
      htmlID: "share-data",
      content: (
        <>
          <p>
            Privately share your data so your colleagues can view and edit your
            work.
          </p>
          <p>
            Publish your dataset where anyone can view, download, and run
            analyses on it.
          </p>
        </>
      ),
    },
    {
      name: "Use Data",
      image: useImage,
      htmlID: "use-data",
      content: (
        <>
          <p>
            Create snapshots of your datasets to ensure past analyses remain
            reproducible as your datasets grow and change. Publish any of your
            snapshots while you continue work on your original data behind the
            scenes.
          </p>
          <p>
            Explore your published OpenNeuro dataset using{" "}
            <a href="https://brainlife.io/">BrainLife's</a>{" "}
            computing network. Utilize their community driven apps to run a
            variety of analysis and processing applications in the browser.
          </p>
        </>
      ),
    },
  ],
  support: [
    {
      title: "NIH Brain Initiative",
      alt: "NIH Brain Initiative logo",
      logo: nihbi,
      link: "https://braininitiative.nih.gov/",
    },
    {
      title: "NSF",
      alt: "National Science Foundation",
      logo: nsf,
      link: "https://www.nsf.gov/",
    },
    {
      title: "Stanford",
      alt: "Stanford",
      logo: stanford,
      link: "https://www.stanford.edu",
    },
    {
      title: "Arnold Foundation",
      alt: "Arnold Foundation",
      logo: ljaf,
      link: "http://www.arnoldfoundation.org/",
    },
    {
      title: "Squishymedia",
      alt: "Squishymedia",
      logo: squishymedia,
      link: "https://squishymedia.com",
    },
    {
      title: "Novonor Disk Fonden",
      alt: "Novonor Disk Fonden logo",
      logo: novo,
      link: "https://novonordiskfonden.dk/en/",
    },
    {
      title: "Neurobiology Research Unit",
      alt: "Neurobiology Research Unit logo",
      logo: nru,
      link: "https://nru.dk/",
    },
  ],
}
