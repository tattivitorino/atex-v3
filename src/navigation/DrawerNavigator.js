import React from 'react';
import { createDrawerNavigator } from 'react-navigation';
import material from '../../native-base-theme/variables/material';

import Sidebar from '../components/sidebar';
import MainStackNavigator from './MainStackNavigator';

const DrawerNavigator = createDrawerNavigator({
    Main: { screen: MainStackNavigator }
}, {
        initialRouteName: 'Main',
        contentComponent: props => <Sidebar {...props} />,
        drawerBackgroundColor: '#ededed',
        drawerWidth: material.deviceWidth * 0.8
    })

export default DrawerNavigator;