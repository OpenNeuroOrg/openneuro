import React from 'react'
import { Story, Meta } from '@storybook/react'
import { CountToggle, CountToggleProps } from './CountToggle'

export default {
  title: 'Components/CountToggle',
  component: CountToggle,
} as Meta

const CountToggleTemplate: Story<CountToggleProps> = ({
  label,
  icon,
  disabled,
  tooltip,
}) => {
  const [clicked, showClicked] = React.useState(false)
  const [count, setCount] = React.useState(1)

  const toggleClick = () => {
    setCount(count === 1 ? 2 : 1)
    showClicked(!clicked)
  }

  return (
    <CountToggle
      label={label}
      icon={icon}
      disabled={disabled}
      toggleClick={toggleClick}
      tooltip={tooltip}
      clicked={clicked}
      showClicked={showClicked}
      count={count}
    />
  )
}

export const Example = CountToggleTemplate.bind({})
Example.args = {
  icon: 'fa-thumbtack',
  disabled: false,
  tooltip: 'hello Tip',
  label: 'Follow',
}

Example.parameters = {
  layout: 'centered',
}

export const disabled = CountToggleTemplate.bind({})
disabled.args = {
  icon: 'fa-thumbtack',
  disabled: true,
  tooltip: 'hello Tip',
  label: 'Follow',
}

disabled.parameters = {
  layout: 'centered',
}
