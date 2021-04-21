import React from 'react'
import { Story, Meta } from '@storybook/react'

import { Cube, CubeProps } from './Cube'

import petScan from '../assets/pet-scan.jpg'

export default {
  title: 'Components/Cube',
  component: Cube,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as Meta

const Template: Story<CubeProps> = args => <Cube {...args} />

export const Default = Template.bind({})
Default.args = {
  label: 'PET',
  backgroundColor: 'rgba(0, 139, 255, 1)',
  cubeImage: petScan,
  stats: (
    <>
      200 Datasets
      <br />
      200 Participants
    </>
  ),
}
