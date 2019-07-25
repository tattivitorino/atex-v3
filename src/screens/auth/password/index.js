import React, { Component } from 'react';
import { View, Alert } from 'react-native';
import { Container, Content } from 'native-base';

import { connect } from 'react-redux';
import { clearAuthError } from '../../../store/actions';

import BaseHeader from '../../../components/baseHeader';

import PasswordForm from '../../../components/forms/password';
import Loader from '../../../components/common/loader';

import styles from '../styles';

class Password extends Component {

  constructor(props) {
    super(props);
    this.state = {
      error: this.props.error
    };
  }

  _showAlert(title, body) {
    console.log('PASSWORD ALERT');
    Alert.alert(title, body, [
      {
        text: 'OK',
        onPress: () => {
          this.props.clearAuthError();
        }
      }
    ], { cancelable: false })
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.error !== prevState.error) return { error: nextProps.error }
    return null;
  }

  componentDidUpdate(prevProps, prevState) {
    //console.log('did update', prevState, this.state);
    if (prevState.error !== this.state.error) {
      if (this.state.error !== null && this.state.error.screen === 'password') {
        setTimeout(() => {
          this._showAlert('SENHA', this.state.error.message)
        }, 800)
      }
    }
  }

  renderLoader() {
    const { sending } = this.props;
    if (sending && sending.screen == 'password') return (
      <Loader
        visible={true}
        textContent={'Enviando seu email...'} />
    );
    return null;
  }

  render() {
    return (
      <Container>
        <BaseHeader back navigation={this.props.navigation} title="Recuperar Senha" />
        {this.renderLoader()}
        <Content padder>
          <View style={{ marginVertical: 20 }}>
            <PasswordForm />
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

export default connect(mapStateToProps, { clearAuthError })(Password);