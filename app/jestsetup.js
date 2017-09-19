// Make Enzyme functions available in all test files without importing
import React from 'react';
import { shallow, render, mount } from 'enzyme';
import moment from 'moment-timezone';

// Run all tests in virtual Katmandu (UTC +05:45)
moment.tz.setDefault('Asia/Katmandu');

global.React = React;
global.shallow = shallow;
global.render = render;
global.mount = mount;

// Fail tests on any warning
console.error = message => {
    throw new Error(message);
};
