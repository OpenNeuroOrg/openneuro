import React from 'react'
import { Story, Meta } from '@storybook/react'

import {
  FacetSelect,
  FacetSelectProps,
  FacetSelectValueType,
} from './FacetSelect'
import { modalities } from '../mock-content/facet-content'

export default {
  title: 'Components/Facet',
  component: FacetSelect,
} as Meta

const FacetSelectTemplate: Story<FacetSelectProps> = ({ items, label }) => {
  const [selected, setSelected] = React.useState<FacetSelectValueType>()

  return (
    <div>
      <FacetSelect
        items={items}
        selected={selected}
        setSelected={setSelected}
        label={label}
      />
    </div>
  )
}

export const FacetExample = FacetSelectTemplate.bind({})
FacetExample.args = {
  items: modalities,
}
