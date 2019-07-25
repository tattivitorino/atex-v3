// @flow

import variable from './../variables/platform';

export default (variables /* : * */ = variable) => {
  const textTheme = {
    fontSize: variables.DefaultFontSize,
    fontFamily: variables.fontFamily,
    color: variables.textColor,
    '.note': {
      color: '#a7a7a7',
      fontSize: variables.noteFontSize
    },
    '.fontSmall': {
      fontSize: 14,
    },
    '.fontLarge': {
      fontSize: 18,
    },
    '.fontBold': {
      fontFamily: 'Roboto_bold',
    },
    '.fontMedium': {
      fontFamily: 'Roboto_medium',
    },
    '.fontLight': {
      fontFamily: 'Roboto_light',
    }, 
    '.primary': {
      color: variables.brandPrimary
    },
    '.secondary': {
      color: variables.brandSecondary
    },
    '.info': {
      color: variables.brandInfo
    },
    '.success': {
      color: variables.brandSuccess
    },
    '.danger': {
      color: variables.brandDanger
    },
    '.warning': {
      color: variables.brandWarning
    },
    '.light': {
      color: variables.brandLight
    },
    '.medium': {
      color: variables.brandMedium
    },
    '.dark': {
      color: variables.brandDark
    },
    '.white': {
      color: '#fff'
    },
    '.black': {
      color: '#000'
    }
  };

  return textTheme;
};
