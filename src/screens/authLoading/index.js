import React, { Component } from 'react';
import { Alert, Platform, Vibration, NetInfo } from 'react-native';
import { Notifications } from 'expo';
import { Container, Content, Spinner, Text } from 'native-base';
import material from '../../../native-base-theme/variables/material';

import { connect } from 'react-redux';
import { userStateRequest, fetchNotificationsRequest } from '../../store/actions';
import { registerForPushNotifications } from '../../services/PushService';

class AuthLoading extends Component {

  constructor(props) {
    super(props);
    this.state = {
      pushError: null
    }
    this._vibrate = this._vibrate.bind(this);
  }

  componentDidMount() {
    this._setUpForNotifications();
    this._notificationSubscription = Notifications.addListener(this._handleNotification);    
    //this.props.userStateRequest();
  }

  render() {
    return (
      <Container>
        <Content contentContainerStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Spinner color={material.brandAtex} />
          {this.state.pushError && <Text>Você está parado nesta tela porque deu erro no PushToken! Tire um screenshot e mande para a Tatti! :P</Text>}
          {this.state.pushError && <Text>{this.state.pushError}</Text>}
        </Content>
      </Container>
    );
  }

  _setUpForNotifications = async () => {
    try {
      const pushToken = await registerForPushNotifications();
      this.props.userStateRequest();
    } catch (e) {
      this.setState({
        pushError: e
      })
    }
  }

  _vibrate = () => {
    let pattern = [10, 2000, 1000, 2000];
    if (Platform.OS === 'ios') {
      pattern = [10, 1000, 1000];
    }
    Vibration.vibrate(pattern)
  }

  // {"title":"Pré-cadastro Aprovado","body":"O Pré-cadastro Jammie Lannister foi aprovado!","type":"pre-cadastro","id":5}
  //IOS ExponentPushToken[tsTCLSDuNLZC3PCdfaZfEw] iphone 7
  //Android: ExponentPushToken[5KnfhzNYsxNWFVSeJ2Ewvz] tablet

  /**
   * {
      "actionId": null,
      "data": Object {
        "title":"",
        "body":"",
        "type":"pre-cadastro",
        "id":""
      },
      "origin": "received",
      "remote": true,
      "userText": null,
    }
   */

  _handleNotification = notification => {
    //console.log(notification);
    if (notification.origin === 'received') {
      this._vibrate()
      this.props.fetchNotificationsRequest({ page: 1 })
    } else if (notification.origin === 'selected') {
      this.props.navigation.navigate('ClienteDetail', { id: notification.data.id })
    }
  }
}

export default connect(null, {
  userStateRequest,
  fetchNotificationsRequest
})(AuthLoading);

