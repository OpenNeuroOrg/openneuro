import React from 'react'
import { Story, Meta } from '@storybook/react'
import { useQuery, useMutation } from 'graphql-hooks'
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
  const [displayOptions, setDisplayOptions] = React.useState(false)
  const [count, setCount] = React.useState(1)

  const onClick = () => {
    let newCount
    count === 1 ? (newCount = 2) : (newCount = 1)
    setCount(newCount)
  }

  return (
    <CountToggle
      label={label}
      icon={icon}
      disabled={disabled}
      onClick={onClick}
      tooltip={tooltip}
      displayOptions={displayOptions}
      setDisplayOptions={setDisplayOptions}
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
