import {
    createStackNavigator
} from 'react-navigation';

import { transitionConfig } from './config';

//Auth Stack
import Login from '../screens/auth/login';
import Password from '../screens/auth/password';
import Terms from '../screens/auth/terms';

const AuthNavigator = createStackNavigator({
    Login: { screen: Login },
    Password: { screen: Password },
    Terms: { screen: Terms }
}, {
        initialRouteName: 'Login',
        //transitionConfig,
        defaultNavigationOptions: {
            header: null,
            headerMode: 'screen'
        }
    });

export default AuthNavigator;