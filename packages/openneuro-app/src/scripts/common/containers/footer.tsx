import React, { FC } from 'react'
import { Footer } from '@openneuro/components/footer'
import { version as openneuroVersion } from '../../../lerna.json'

const FooterContainer: FC = () => {
  return (
    <>
      <Footer version={openneuroVersion} />
    </>
  )
}

export default FooterContainer
