import React from 'react'
import { faq } from './faq-content'
import Helmet from 'react-helmet'
import { FAQS } from '@openneuro/components/faqs'
import { pageTitle } from '../../resources/strings.js'

const Faq = () => (
  <>
    <Helmet>
      <title>Frequently Asked Questions - {pageTitle}</title>
    </Helmet>
    <FAQS content={faq} />
  </>
)

export default Faq
