import React from 'react'
import { Story, Meta } from '@storybook/react'

import { Loading, LoadingProps } from './Loading'

export default {
  title: 'Components/Loading',
  component: Loading,
} as Meta

const Template: Story<LoadingProps> = args => <Loading {...args} />

export const Default = Template.bind({})
