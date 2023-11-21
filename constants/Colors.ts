const primary_100 = '#a22bfa';
const white_50 = '#fff';
const red_100 = '#ff2d55';
const blue_100 = '#5ac8fa';
const gray_50 = '#f0f0f0';
const gray_100 = '#e5e5e5';
const gray_200 = '#afafaa';
const gray_500 = '#4f4f4f';
const gray_900 = '#030303';


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
    background: gray_50,
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
    gray50: gray_50,
    gray100: gray_100,
    gray200: gray_200,
    gray500: gray_500,
    gray900: gray_900,
    white50: white_50,

    text: '#030303',
    altText: gray_500,
    background: '#fff',
    tint: primary_100,
    tabIconDefault: gray_100,
    tabIconSelected: '#888',
  },

  dark: {
    primary100: primary_100,
    red100: red_100,
    blue100: blue_100,
    gray50: gray_50,
    gray100: gray_100,
    gray200: gray_200,
    gray500: gray_500,
    gray900: gray_900,
    white50: white_50,

    altText: gray_500,
    text: '#fff',
    background: '#030303',
    tint: white_50,
    tabIconDefault: gray_100,
    tabIconSelected: white_50,
  },
};
