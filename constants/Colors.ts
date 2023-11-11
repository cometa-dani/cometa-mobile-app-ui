const primary_100 = '#a22bfa';
const white_50 = '#fff';
const red_100 = '#ff2d55';
const blue_100 = '#5ac8fa';
const gray_100 = '#e5e5e5';
const gray_500 = '#4f4f4f';


export const buttonColors = {
  primary: {
    background: primary_100,
    color: '#fff'
  },

  blue: {
    background: '#5ac8fa',
    color: '#000'
  },

  gray: {
    background: '#f0f0f0',
    color: '#000'
  },

  black: {
    background: '#030303',
    color: '#fff'
  },

  white: {
    background: '#fff',
    color: '#030303'
  }
};

export default {
  light: {
    primary100: primary_100,
    red100: red_100,
    blue100: blue_100,
    gray100: gray_100,
    text: '#030303',
    textContent: gray_500,
    background: '#fff',
    tint: primary_100,
    tabIconDefault: gray_100,
    tabIconSelected: '#888',
  },

  dark: {
    primary100: primary_100,
    red100: red_100,
    blue100: blue_100,
    gray100: gray_100,
    textContent: gray_500,
    text: '#fff',
    background: '#030303',
    tint: white_50,
    tabIconDefault: gray_100,
    tabIconSelected: white_50,
  },
};
