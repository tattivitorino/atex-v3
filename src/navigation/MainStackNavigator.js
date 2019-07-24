import React from 'react';
import { createStackNavigator } from 'react-navigation';
import { modalTransitionConfig } from './config';
import material from '../../native-base-theme/variables/material';

import MainTabNavigator from './MainTabNavigator';
import ImagePickerScreen from '../screens/main/image';
import CameraScreen from '../screens/main/camera';
import NotificacoesScreen from '../screens/main/notificacoes';
import MediaPlayerScreen from '../screens/main/media-player';

const MainStackNavigator = createStackNavigator({
    Tabs: { screen: MainTabNavigator },
    ImagePicker: { screen: ImagePickerScreen },
    Camera: { screen: CameraScreen },
    Notificacoes: { screen: NotificacoesScreen },
    MediaPlayer: { screen: MediaPlayerScreen }
}, {
        initialRouteName: 'Tabs',
        mode: 'modal',
        modalTransitionConfig,
        defaultNavigationOptions: {
            header: null,
            headerMode: 'screen'
        }
    });

export default MainStackNavigator;