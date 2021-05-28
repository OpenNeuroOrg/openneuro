import React from 'react'
import { Story, Meta } from '@storybook/react'

import { FacetListWrap, FacetListWrapProps } from './FacetListWrap'

export default {
  title: 'Components/Facet',
  component: FacetListWrap,
} as Meta

const FacetListWrapTemplate: Story<FacetListWrapProps> = ({
  items,
  startOpen,
  label,
  accordionStyle,
  dropdown,
}) => {
  const [selected, setSelected] = React.useState()

  return (
    <div>
      <FacetListWrap
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

const modalities = [
  {
    label: 'MRI',
    value: 'MRI',
    count: 3000,
    children: [
      {
        label: 'Functional',
        value: 'Functional',
        count: 300,
      },
      {
        label: 'Structural',
        value: 'Structural',
        count: 200,
      },
      {
        label: 'Diffusion',
        value: 'Diffusion',
        count: 300,
      },
      {
        label: 'Perfusion',
        value: 'Perfusion',
        count: 150,
      },
    ],
  },
  {
    label: 'EEG',
    value: 'EEG',
    count: 303,
    children: [
      {
        label: 'ECoG',
        value: 'ECoG',
        count: 300,
      },
      {
        label: 'SEEG',
        value: 'SEEG',
        count: 200,
      },
    ],
  },
  {
    label: 'MEG',
    value: 'MEG',
    count: 330,
  },
  {
    label: 'PET',
    value: 'PET',
    count: 30,
    children: [
      {
        label: 'Static',
        value: 'Static',
        count: 300,
      },
      {
        label: 'Dynamic',
        value: 'Dynamic',
        count: 200,
      },
    ],
  },
]
export const FacetExample = FacetListWrapTemplate.bind({})
FacetExample.args = {
  items: modalities,
  accordionStyle: 'plain',
  label: 'Modalities',
  startOpen: true,
}

export const FrontFacetExample = FacetListWrapTemplate.bind({})
FrontFacetExample.args = {
  items: modalities,
  accordionStyle: 'plain',
  label: 'Browse by Modalities',
  startOpen: false,
  dropdown: true,
}
