import React from 'react'
import { Story, Meta } from '@storybook/react'

import { AffiliateArticle, AffiliateArticleProps } from './AffiliateArticle'

import bidsLogo from '../assets/bids.jpg'

export default {
  title: 'Components/AffiliateArticle',
  component: AffiliateArticle,
} as Meta

const Template: Story<AffiliateArticleProps> = args => (
  <AffiliateArticle {...args} />
)

export const Bids = Template.bind({})
Bids.args = {
  logo: bidsLogo,
  header: 'Validation Using BIDS',
  contentOne: (
    <>
      The <a href="#">Brain Imaging Data Structure</a> (BIDS) is an emerging
      standard for the organisation of neuroimaging data.{' '}
    </>
  ),
  contentTwo: (
    <>
      Want to contribute to BIDS?
      <br /> Visit the <a href="#">Google discussion group</a> to contribute.
    </>
  ),
}
