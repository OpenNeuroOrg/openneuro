import React from "react"
import type { FC } from "react"
import { Footer } from "../../components/footer/Footer"
import { version as openneuroVersion } from "../../../lerna.json"

const FooterContainer: FC = () => {
  return (
    <>
      <Footer version={openneuroVersion} />
    </>
  )
}

export default FooterContainer
