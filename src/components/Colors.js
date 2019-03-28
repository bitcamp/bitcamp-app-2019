const bitcampColorPalette = {
  brown: {
    dark: "#7F6C5F",
    medium: "#A58D7C",
    light: "#E5D8CE"
  },
  white: "#FFFFFF",

  // the 3 colors below are not part of the 2019 Style Guide
  lightGrey: "#f9f9f9",
  darkGrey: "#8d8c92",
  black: "#000000",
  backgroundGrey: '#EFEFF4',

  red: "#FF3F46",
  orange: {
    bitcamp: "#FF6F3F",
    yellow: "#FFAF3F" // yellow-orange
  },
  yellow: "#FFEF3F",
  darkYellow: "#FFD83F",
  blue: {
    midnight: "#1A2E33",
    medium: "#528CA5",
    sky: "#CBF2FF"
  }
};

// "light" refers to a more subtle color
export const colors = {
  starColor: {
    selected: bitcampColorPalette.darkYellow,
    unselected: '#b7b7bb',
  },
  textColor: {
    primary: bitcampColorPalette.white, // on primary background

    light: bitcampColorPalette.darkGrey,
    normal: bitcampColorPalette.black,
  },
  borderColor: {
    light: bitcampColorPalette.lightGrey,
    normal: bitcampColorPalette.darkGrey
  },
  backgroundColor: {
    light: bitcampColorPalette.lightGrey,
    normal: bitcampColorPalette.white,
    dark: bitcampColorPalette.backgroundGrey
  },
  iconColor: bitcampColorPalette.red,
  secondaryColor: bitcampColorPalette.orange.yellow,
  primaryColor: bitcampColorPalette.orange.bitcamp,
  blues: {
    midnight: bitcampColorPalette.blue.midnight,
    medium: bitcampColorPalette.blue.medium,
    sky: bitcampColorPalette.blue.sky
  }
};
