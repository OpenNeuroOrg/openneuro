// Make Enzyme functions available in all test files without importing
import React from 'react';
import { shallow, render, mount } from 'enzyme';

global.React = React;
global.shallow = shallow;
global.render = render;
global.mount = mount;
