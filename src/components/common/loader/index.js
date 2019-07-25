import React from 'react';
import Spinner from 'react-native-loading-spinner-overlay';

const Loader = ({
  visible,
  textContent
}) => (
    <Spinner
      visible={visible}
      textContent={textContent}
      animation={'fade'}
      overlayColor={'rgba(0,0,0,0.5)'}
      textStyle={{ color: '#fff' }} />
  );

export default Loader;
