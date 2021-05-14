import React from 'react'
import { Story, Meta } from '@storybook/react'

import { AccordionTab } from '../accordion/AccordionTab'
import { AccordionWrap } from '../accordion/AccordionWrap'

import { FacetListWrap, FacetListWrapProps } from './FacetListWrap'

export default {
  title: 'Components/Facet',
  component: FacetListWrap,
} as Meta

const FacetListWrapTemplate: Story<FacetListWrapProps> = ({ items }) => {
  const [selected, setSelected] = React.useState()

  return (
    <div style={{ width: '400px' }}>
      <AccordionWrap className="facet-accordion">
        <AccordionTab
          accordionStyle="plain"
          label="Modalities"
          startOpen={true}>
          <FacetListWrap
            items={items}
            selected={selected}
            setSelected={setSelected}
          />
        </AccordionTab>
      </AccordionWrap>
    </div>
  )
}

const modalities = [
  {
    label: 'MRI',
    value: 'mri',
    count: 30,
    children: [
      {
        label: 'Structural',
        value: 'structural',
        count: 30,
      },
      {
        label: 'Diffusional',
        value: 'diffusional',
        count: 30,
      },
    ],
  },
  {
    label: 'PET',
    value: 'pet',
    count: 30,
  },
  {
    label: 'ASL',
    value: 'asl',
    count: 30,
  },
  {
    label: 'EEG',
    value: 'eeg',
    count: 30,
  },
  {
    label: 'ECoG',
    value: 'ecog',
    count: 30,
  },
]
export const FacetExample = FacetListWrapTemplate.bind({})
FacetExample.args = {
  items: modalities,
}
