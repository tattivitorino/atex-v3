import { YellowBox } from 'react-native';

import React, {Component} from 'react';
import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';

import { Ionicons, Entypo, AntDesign } from '@expo/vector-icons';

import { Container, Content, Text, StyleProvider } from 'native-base';
import getTheme from './native-base-theme/components';
import material from './native-base-theme/variables/material';

import { Provider } from 'react-redux';
import store from './src/store';

import NavigationService from './src/services/NavigationService';
import RootNavigator from './src/navigation/RootNavigator';

YellowBox.ignoreWarnings([
  'Remote debugger is in a background tab which may cause apps to perform slowly',
  '<InputAccessoryView> is not supported on Android yet.',
  'Require cycles are allowed, but can result in uninitialized values. Consider refactoring to remove the need for a cycle.'
]);

class App extends Component{
  constructor(props) {
    super(props);
    this.state = {
      isReady: false
    };
  }
  render(){
    if (!this.state.isReady && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    }
    else {
      return (
        <Provider store={store}>
          <StyleProvider style={getTheme(material)}>
            <RootNavigator
              ref={navigatorRef => {
                NavigationService.setTopLevelNavigator(navigatorRef)
              }}
            />
          </StyleProvider>
        </Provider>
      );
    }
  }

  _loadResourcesAsync = async () => {

    return Promise.all([
      Asset.loadAsync([
        require('./assets/imgs/logo.png'),
        require('./assets/imgs/logo-clean.png')
      ]),
      Font.loadAsync({
        'Roboto': require('native-base/Fonts/Roboto.ttf'),
        'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
        'Roboto_light': require('./assets/fonts/roboto-light.ttf'),
        'Roboto_bold': require('./assets/fonts/roboto-bold.ttf'),
        ...Ionicons.font,
        ...Entypo.font,
        ...AntDesign.font
      })
    ]);
  }
  _handleLoadingError = error => {
    console.log(error);
  };
  _handleFinishLoading = () => {
    this.setState({ isReady: true });
  };
}

export default App;