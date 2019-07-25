// @flow

import variable from './../variables/platform';

export default (variables /* : * */ = variable) => {
  const h2Theme = {
    color: variables.textColor,
    fontSize: variables.fontSizeH2,
    lineHeight: variables.lineHeightH2,
    '.fontBold': {
      fontFamily: 'Roboto_bold',
    },
    '.fontMedium': {
      fontFamily: 'Roboto_medium',
    },
    '.fontLight': {
      fontFamily: 'Roboto_light',
    },
    '.note': {
      color: '#a7a7a7',
      fontSize: variables.noteFontSize
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

  return h2Theme;
};
