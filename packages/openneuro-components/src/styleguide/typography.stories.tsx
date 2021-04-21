import React from 'react'
import { Story, Meta } from '@storybook/react';
import { Typography, TypographyProps } from './Typography'

export default {
  title: 'Style guide/Typography',
  component: Typography,
}as Meta;


const Template: Story<TypographyProps> = (args) => <Typography {...args} />;


export const Default = Template.bind({})
