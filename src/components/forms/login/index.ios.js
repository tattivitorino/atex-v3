import React, { Component } from 'react';
import { View, Keyboard } from 'react-native';
import { Item, Input, Label, Body, Button, Text, Card, CardItem, Icon } from 'native-base';
import { Field, reduxForm, formValueSelector, change } from 'redux-form';
import { validateEmail, validateRequired } from '../../../utils';

import styles from '../styles';

import { connect } from 'react-redux';
import { loginRequest, loadUserCredentials } from '../../../store/actions';

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.inputs = {};
  }

  componentDidMount() {
    this.props.loadUserCredentials()
  }

  login = () => {
    Keyboard.dismiss();
    const { email, password, loginRequest } = this.props;
    loginRequest({ email, password });
  }

  focusNext = (field) => {
    this.inputs[field]._root.focus()
  }

  getInput = (input) => {

    switch (input.name) {
      case 'email':
        return (
          <Input {...input}
            ref={ref => this.inputs['email'] = ref}
            keyboardType="email-address"
            textContentType="emailAddress"
            autoCapitalize="none"
            returnKeyType="next"
            blurOnSubmit={false}
            onSubmitEditing={() => {
              this.focusNext('password');
            }} />
        )

      case 'password':
        return (
          <Input {...input}
            ref={ref => this.inputs['password'] = ref}
            keyboardType="default"
            textContentType="none"
            returnKeyType="done"
            secureTextEntry
            blurOnSubmit={true}
            onSubmitEditing={() => {
              this.login()
            }} />
        )

      default:
        return <Input {...input} />
    }
  }

  renderInput = ({ input, label, type, meta: { touched, error }, ...custom }) => {
    const { width, required } = custom;
    let hasError = false;
    if (touched && error !== undefined) {
      hasError = true;
    }
    return (
      <View style={[styles.field, { width: width }]}>
        <Item underline stackedLabel error={hasError}>
          <Label>{label}:{required ? <Text danger>**</Text> : null}</Label>
          {this.getInput(input)}
        </Item>
        {hasError ? <Text style={styles.fieldErrorMessage}>{error}</Text> : null}
      </View>
    );
  }

  render() {
    const { handleSubmit, submitting } = this.props;
    return (
      <Card style={styles.card}>
        <CardItem>
          <Body>

            <Text>
              Se você já é cadastrado use o formulário abaixo para entrar.
            </Text>

            <View style={styles.fieldsContainer}>

              <Field label="Email" name="email" width="100%" required
                component={this.renderInput}
                validate={[validateRequired, validateEmail]}
                parse={value => value ? value.trim() : value} />

              <Field label="Senha" name="password" width="100%" required
                component={this.renderInput} validate={validateRequired}
                parse={value => value ? value.trim() : value} />

            </View>

            <View style={styles.buttonsBar}>
              <Button disabled={submitting} onPress={() => {
                this.props.change('email', '');
                this.props.change('password', '');
              }}
                light style={[styles.button, { flex: 1 }]}>
                <Text>Limpar</Text>
              </Button>
              <Button disabled={submitting} onPress={handleSubmit(this.login)}
                primary style={[styles.button, { flex: 2, marginLeft: 15 }]}>
                <Text>Entrar</Text>
              </Button>
            </View>

          </Body>
        </CardItem>
      </Card>
    );
  }
}

const selector = formValueSelector('login');

const mapStateToProps = state => {
  const { userCredentials } = state.auth;
  const { email, password } = selector(state, 'email', 'password');
  return { email, password, initialValues: userCredentials }
}

LoginForm = reduxForm({
  form: 'login',
  enableReinitialize: true,
  touchOnBlur: true
})(LoginForm);

LoginForm = connect(mapStateToProps, { loginRequest, loadUserCredentials, change })(LoginForm);

export default LoginForm;
