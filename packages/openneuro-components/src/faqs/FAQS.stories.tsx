import React from 'react'
import { Story, Meta } from '@storybook/react'

import { faq } from '../mock-content/faq-content'
import { FAQS } from './FAQS'

export default {
  title: 'Components/FAQs',
  component: FAQS,
} as Meta

const Template: Story = args => <FAQS content={faq} />

export const FAQExample = Template.bind({})
