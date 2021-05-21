import React from 'react'
import { Story, Meta } from '@storybook/react'

import { WarnButton, WarnButtonProps } from './WarnButton'

export default {
  title: 'Components/WarnButton',
  component: WarnButton,
} as Meta

const WarnButtonTemplate: Story<WarnButtonProps> = ({
  message,
  cancel,
  confirm,
  icon,
  warn,
  tooltip,
  onClick,
}) => {
  return (
    <WarnButton
      message={message}
      cancel={cancel}
      confirm={confirm}
      icon={icon}
      warn={warn}
      tooltip={tooltip}
      onClick={onClick}
      tooltip={tooltip}
    />
  )
}

export const Example = WarnButtonTemplate.bind({})
Example.args = {
  message: '',
  cancel: <i className="fa fa-times" />,
  confirm: <i className="fa fa-check" />,
  icon: 'fa-trash-o',
  warn: true,
  tooltip: 'hello TT',
  onClick: () => console.log('clicked'),
}

Example.parameters = {
  layout: 'centered',
}
