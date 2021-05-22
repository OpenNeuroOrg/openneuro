import React from 'react'
import { Story, Meta } from '@storybook/react'

import { WarnButton, WarnButtonProps } from './WarnButton'

export default {
  title: 'Components/WarnButton',
  component: WarnButton,
} as Meta

const WarnButtonTemplate: Story<WarnButtonProps> = ({
  message,
  icon,
  disabled,
  tooltip,
  onClick,
}) => {
  const [displayOptions, setDisplayOptions] = React.useState(false)
  return (
    <WarnButton
      message={message}
      icon={icon}
      disabled={disabled}
      onClick={onClick}
      tooltip={tooltip}
      displayOptions={displayOptions}
      setDisplayOptions={setDisplayOptions}
    />
  )
}

export const Example = WarnButtonTemplate.bind({})
Example.args = {
  icon: 'fa-trash-o',
  disabled: false,
  tooltip: 'hello Tip',
  onClick: () => console.log('clicked'),
  message: 'message?',
}

Example.parameters = {
  layout: 'centered',
}
