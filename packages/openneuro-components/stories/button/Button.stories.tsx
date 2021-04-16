import React from 'react';
import { Story, Meta } from '@storybook/react';

import { Button, ButtonProps } from './Button';

import orcidIcon from '../assets/orcid_24x24.png'

export default {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    backgroundColor: { control: 'color' },
    color: { control: 'color' },
  },
} as Meta;

const Template: Story<ButtonProps> = (args) => <Button {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  primary: true,
  label: 'Primary',
};

export const Secondary = Template.bind({});
Secondary.args = {
  secondary: true,
  label: 'SECONDARY',
};

export const NoBackground = Template.bind({});
NoBackground.args = {
  label: 'No Background',
};

export const NoBackgroundLightColor = Template.bind({});
NoBackgroundLightColor.parameters = {
  backgrounds: { default: 'dark' }
};
NoBackgroundLightColor.args = {
  label: 'No Background',
  color: '#fff',
};

export const NoBGIcon = Template.bind({});
NoBGIcon.parameters = {
  backgrounds: { default: 'dark' }
};
NoBGIcon.args = {
  label: 'Sign in with Google',
  color: '#fff',
  icon: 'fab fa-google',
  iconSize: '23px',
};



export const NoBGImg = Template.bind({});
NoBGImg.parameters = {
  backgrounds: { default: 'dark' }
};
NoBGImg.args = {
  label: 'Sign in with ORCID',
  color: '#fff',
  imgSrc: orcidIcon,
  iconSize: '23px',
};



export const Large = Template.bind({});
Large.args = {
  primary: true,
  size: 'large',
  label: 'Large',
};

export const Small = Template.bind({});
Small.args = {
  primary: true,
  size: 'small',
  label: 'small',
};


export const Navbar = Template.bind({});
Navbar.args = {
  primary: true,
  label: 'Sign in',
  navbar: true,
  size: 'large'
};


export const IconNoText = Template.bind({});
IconNoText.args = {
  primary: true,
  icon: 'fas fa-search',
  size: 'large',
};


export const IconText = Template.bind({});
IconText.args = {
  primary: true,
  label: 'Download',
  icon: 'fas fa-download',
};


export const OnClick = Template.bind({});
OnClick.args = {
  primary: true,
  label: 'Click Me',
  onClick: () => alert('clicked'),
};


export const Disabled = Template.bind({});
Disabled.args = {
  primary: true,
  label: 'Disabled',
  disabled: true,
};