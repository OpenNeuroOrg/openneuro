import React from 'react'
import { Story, Meta } from '@storybook/react'

import { FAQS } from './FAQS'

export default {
  title: 'Components/FAQs',
  component: FAQS,
} as Meta

const Template: Story = args => <FAQS />

export const FAQExample = Template.bind({})
