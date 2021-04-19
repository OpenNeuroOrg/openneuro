import React from 'react'

import { Story, Meta } from '@storybook/react';
import { AccordionWrap, AccordionWrapProps } from './AccordionWrap'
import { AccordionTab } from './AccordionTab';

export default {
  title: 'Components/Accordion',
  component: AccordionWrap,
} as Meta;

const Template: Story<AccordionWrapProps> = (args) => <AccordionWrap {...args} />;


const singleTabAccordion = <AccordionTab accordionStyle="plain" name='single' tabId='tab1' tabLable='Single Tab' children='This is a single accordion' />


const multiTabAccordion = (<>
  <AccordionTab accordionStyle="plain" tabLable='one' children={<><h4 style={{margin: 0}}>heading</h4><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p></>} />
  <AccordionTab accordionStyle="plain" tabLable='two' children='Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' />
  <AccordionTab accordionStyle="plain" tabLable='three' children='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' />
  <AccordionTab accordionStyle="plain" tabLable='four' children='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt' />
</>)

const fileTreeAccordion = (<>
  <AccordionTab accordionStyle="file-tree" tabLable='one' children={<AccordionWrap><AccordionTab accordionStyle="file-tree" tabLable='Another Folder' children="file"/></AccordionWrap>} />
  <AccordionTab accordionStyle="file-tree" tabLable='two' children={<>File</>} />
  <AccordionTab accordionStyle="file-tree" tabLable='three' children={<AccordionWrap><AccordionTab accordionStyle="file-tree" tabLable='Another Folder' children="file"/></AccordionWrap>} />
  <AccordionTab accordionStyle="file-tree" tabLable='four' children={<AccordionWrap><AccordionTab accordionStyle="file-tree" tabLable='Another Folder' children="file"/></AccordionWrap>} />
</>)


export const SingleTabAccordion = Template.bind({})
SingleTabAccordion.args = {
  accordionID: 'single-tab-accordion',
  children: singleTabAccordion
}


export const MultiTabAccordion= Template.bind({})
MultiTabAccordion.args = {
  accordionID: 'multi-tab-accordion',
  children: multiTabAccordion
}




export const FileTreeAccordion= Template.bind({})
FileTreeAccordion.args = {
  accordionID: 'multi-tab-accordion',
  children: fileTreeAccordion
}


