import React from 'react'

import { Story, Meta } from '@storybook/react';
import { AccordionWrap, AccordionWrapProps } from './AccordionWrap'
import { AccordionTab } from './AccordionTab';

export default {
  title: 'Components/Accordion',
  component: AccordionWrap,
} as Meta;

const Template: Story<AccordionWrapProps> = (args) => <AccordionWrap {...args} />;




export const SingleTabAccordion = Template.bind({})
const singleTabAccordion = <AccordionTab  name='single' tabId='tab1' tabLable='Single Tab' children='This is a single accordion' />
const multiTabAccordionOne = (<>
  <AccordionTab expandOne name="onlyOne" tabId='tab1' tabLable='one' children={<><h4 style={{margin: 0}}>heading</h4><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p></>} />
  <AccordionTab expandOne name="onlyOne" tabId='tab2' tabLable='two' children='Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' />
  <AccordionTab expandOne name="onlyOne" tabId='tab3' tabLable='three' children='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' />
  <AccordionTab expandOne name="onlyOne" tabId='tab4' tabLable='four' children='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt' />
  <AccordionTab expandOne name="onlyOne" tabId='tab5' tabLable='Close' />
</>)

const multiTabAccordionAll = (<>
  <AccordionTab  name="any" tabId='tab1' tabLable='one' children={<><h4 style={{margin: 0}}>heading</h4><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p></>} />
  <AccordionTab name="any" tabId='tab2' tabLable='two' children='Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' />
  <AccordionTab name="any" tabId='tab3' tabLable='three' children='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' />
  <AccordionTab name="any" tabId='tab4' tabLable='four' children='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt' />
  <AccordionTab name="any" tabId='tab5' tabLable='Close' />
</>)

SingleTabAccordion.args = {
  accordionID: 'single-tab-accordion',
  children: singleTabAccordion
}



export const MultiTabAccordionOnlyOne = Template.bind({})

MultiTabAccordionOnlyOne.args = {
  accordionID: 'multi-tab-accordion',
  children: multiTabAccordionOne
}


export const MultiTabAccordionAll = Template.bind({})

MultiTabAccordionAll.args = {
  accordionID: 'multi-tab-accordion',
  children: multiTabAccordionAll
}

