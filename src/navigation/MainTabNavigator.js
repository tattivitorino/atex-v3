import React from 'react';
import {
    createStackNavigator,
    createBottomTabNavigator
} from 'react-navigation';

import { transitionConfig } from './config';
import material from '../../native-base-theme/variables/material';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

//Main Tab Stack
import FrontScreen from '../screens/main/front-screen';
import Dashboard from '../screens/main/dashboard';
import Agenda from '../screens/main/agenda';
import AgendaAdd from '../screens/main/agenda-add';
import AgendaEdit from '../screens/main/agenda-edit';
import ClienteList from '../screens/main/cliente-list';
import ClienteAdd from '../screens/main/cliente-add';
import ClienteAddDoc from '../screens/main/cliente-add-doc';
import ClienteEdit from '../screens/main/cliente-edit';
import ClienteDetail from '../screens/main/cliente-detail';
import Mais from '../screens/main/mais';

const defaultNavigationOptions = {
    header: null,
    headerMode: 'screen'
}

const DashboardStackNavigator = createStackNavigator({
    FrontScreen: { screen: FrontScreen },
    Dashboard: { screen: Dashboard }
}, {
        initialRouteName: 'Dashboard',
        //transitionConfig,
        defaultNavigationOptions
    });

const AgendaStackNavigator = createStackNavigator({
    Agenda: { screen: Agenda },
    AgendaAdd: { screen: AgendaAdd },
    AgendaEdit: { screen: AgendaEdit }
}, {
        initialRouteName: 'Agenda',
        //transitionConfig,
        defaultNavigationOptions
    });

const ClientesStackNavigator = createStackNavigator({
    ClienteList: { screen: ClienteList },
    ClienteAdd: { screen: ClienteAdd },
    ClienteAddDoc: { screen: ClienteAddDoc },
    ClienteDetail: { screen: ClienteDetail },
    ClienteEdit: { screen: ClienteEdit }
}, {
        initialRouteName: 'ClienteList',
        //transitionConfig,
        defaultNavigationOptions
    });

ClientesStackNavigator.navigationOptions = {
    tabBarLabel: 'Pré-cadastros'
}

const MaisStackNavigator = createStackNavigator({
    Mais: { screen: Mais }
}, {
        initialRouteName: 'Mais',
        //transitionConfig,
        defaultNavigationOptions
    });

const MainTabNavigator = createBottomTabNavigator({
    Dashboard: { screen: DashboardStackNavigator },
    Clientes: { screen: ClientesStackNavigator },
    Agenda: { screen: AgendaStackNavigator },
    //Mais: { screen: MaisStackNavigator }
}, {
        initialRouteName: 'Dashboard',
        defaultNavigationOptions: ({ navigation }) => ({
            tabBarIcon: ({ focused, tintColor }) => {
                const { routeName } = navigation.state;
                let IconComponent;
                let iconName;
                let iconSize;
                if (routeName == 'Dashboard') {
                    IconComponent = MaterialIcons;
                    iconName = 'dashboard';
                    iconSize = 28;
                } else if (routeName == 'Agenda') {
                    IconComponent = Ionicons;
                    iconName = 'md-calendar';
                    iconSize = 28;
                } else if (routeName == 'Clientes') {
                    IconComponent = Ionicons;
                    iconName = 'ios-people'
                    iconSize = 33;
                } else if (routeName == 'Mais') {
                    IconComponent = Ionicons;
                    iconName = 'ios-more';
                    iconSize = 33;
                }
                return <IconComponent name={iconName} size={iconSize} color={tintColor} />
            },
            tabBarOnPress: ({ navigation }) => {
                //console.log(navigation);
                if (navigation.isFocused() && navigation.state.index > 0) {
                    navigation.popToTop()
                }
                else {
                    const navigationInRoute = navigation.getChildNavigation(
                        navigation.state.routes[0].key
                    );

                    if (!!navigationInRoute
                        && navigationInRoute.isFocused()
                        && !!navigationInRoute.state.params
                        && !!navigationInRoute.state.params.scrollToTop) {
                        navigationInRoute.state.params.scrollToTop();
                    }
                    else {
                        navigation.navigate(navigation.state.key);
                    }
                }
            }
        }),
        tabBarOptions: {
            activeTintColor: material.brandAtex,
            activeBackgroundColor: '#fff',
            inactiveTintColor: '#000',
            inactiveBackgroundColor: '#fff',
            style: {
                height: 60,
                borderTopWidth: 0,
                shadowOffset: { width: 0, height: -1 },
                shadowColor: '#000',
                shadowOpacity: .1,
                shadowRadius: 5
            },
            labelStyle: {
                fontSize: 12,
                marginBottom: 5,
            }
        }
    });

export default MainTabNavigator;