import React from 'react';
import { Platform, Dimensions } from 'react-native'
import { 
    createAppContainer,
    createSwitchNavigator 
} from 'react-navigation';

import AuthLoading from '../screens/authLoading';
import AuthNavigator from './AuthNavigator';
import DrawerNavigator from './DrawerNavigator'; 

const SwitchNavigator = createSwitchNavigator({
    AuthLoading:AuthLoading,
    Auth:AuthNavigator,
    App:DrawerNavigator
}, {
    initialRouteName:'AuthLoading'
})

const AppContainer = createAppContainer(SwitchNavigator);

export default AppContainer;