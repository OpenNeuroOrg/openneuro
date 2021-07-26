import React, { FC, useContext } from 'react'
import { Footer } from '@openneuro/components/footer'
import ContactForm from '../redesign-form'
import { version as openneuroVersion } from '../../../lerna.json'

const FooterContainer: FC = () => {
  return (
    <>
      <ContactForm />
      <Footer version={openneuroVersion} />
    </>
  )
}

export default FooterContainer
