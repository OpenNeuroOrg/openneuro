import React from 'react'
import { Story, Meta } from '@storybook/react'

import { FacetSelect, FacetSelectProps } from './FacetSelect'
import { modalities } from '../mock-content/facet-content'

export default {
  title: 'Components/Facet',
  component: FacetSelect,
} as Meta

const FacetSelectTemplate: Story<FacetSelectProps> = ({
  items,
  startOpen,
  label,
  accordionStyle,
  dropdown,
}) => {
  const [selected, setSelected] = React.useState()

  return (
    <div>
      <FacetSelect
        items={items}
        selected={selected}
        setSelected={setSelected}
        startOpen={startOpen}
        label={label}
        accordionStyle={accordionStyle}
        dropdown={dropdown}
      />
    </div>
  )
}

export const FacetExample = FacetSelectTemplate.bind({})
FacetExample.args = {
  items: modalities,
  accordionStyle: 'plain',
  label: 'Modalities',
  startOpen: true,
}

export const FrontFacetExample = FacetSelectTemplate.bind({})
FrontFacetExample.args = {
  items: modalities,
  accordionStyle: 'plain',
  label: 'Browse by Modalities',
  startOpen: false,
  dropdown: true,
}
