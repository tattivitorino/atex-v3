import React, { Component } from 'react';
import { View, Dimensions, Alert } from 'react-native';
import { Container, Content, Button, Text } from 'native-base';

import { connect } from 'react-redux';
import { clearAuthError } from '../../../store/actions';

import Image from 'react-native-scalable-image';

const { width } = Dimensions.get('window');
const logoImg = require('../../../../assets/imgs/logo.png');

import styles from '../styles';

import LoginForm from '../../../components/forms/login/index';
import Loader from '../../../components/common/loader';

class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      error: this.props.error
    }
  }

  _showAlert(title, body) {
    console.log('LOGIN ALERT: ', body);
    Alert.alert(title, body, [
      {
        text: 'OK',
        onPress: () => {
          this.props.clearAuthError();
        }
      }
    ], { cancelable: false })
  }

  _navigateTo(page) {
    this.props.navigation.navigate(page);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.error !== prevState.error) return { error: nextProps.error }
    return null;
  }

  componentDidUpdate(prevProps, prevState) {
    //console.log('did update', prevState, this.state);
    if (prevState.error !== this.state.error) {
      if (this.state.error !== null && this.state.error.screen === 'login') {
        setTimeout(() => {
          this._showAlert('Login', this.state.error.message)
        }, 800)
      }
    }
  }

  _renderLoader() {
    const { sending } = this.props;
    if (sending && sending.screen == 'login') return (
      <Loader
        visible={true}
        textContent={'Verificando as suas credenciais...'} />
    );
    return null;
  }

  render() {
    return (
      <Container>

        {this._renderLoader()}

        <Content padder contentContainerStyle={{ justifyContent: 'center' }}>
          <View style={{ alignItems: 'center', paddingTop: 30 }}>
            <Image width={width * 0.8} source={logoImg} />
          </View>

          <View style={{ marginVertical: 20 }}>
            <LoginForm />
          </View>

          <View style={[styles.buttonsContainer]}>
            <Button primary transparent style={styles.button}
              onPress={() => { this._navigateTo('Password') }}>
              <Text>Recuperar Senha</Text>
            </Button>
            <Button primary transparent style={styles.button}
              onPress={() => { this._navigateTo('Terms') }}>
              <Text>Termos e Condições</Text>
            </Button>
          </View>

        </Content>

      </Container>
    );
  }
}

const mapStateToProps = state => {
  const { sending, error } = state.auth;
  return { sending, error };
}

export default connect(mapStateToProps, { clearAuthError })(Login);
