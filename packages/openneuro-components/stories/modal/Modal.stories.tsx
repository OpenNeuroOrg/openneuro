import React, { useState } from 'react'

import { Story, Meta } from '@storybook/react';
import { ModalExample, ModalExampleProps } from './ModalExample'

export default {
  title: 'Components/Modal',
  component: ModalExample,
} as Meta;

const Template: Story<ModalExampleProps> = (args) => <ModalExample {...args} />;

export const BasicModal = Template.bind({})

