import React, { Component } from 'react';
import { View, Keyboard } from 'react-native';
import { Item, Input, Label, Body, Button, Text, Card, CardItem, Form } from 'native-base';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { validateEmail, validateRequired } from '../../../utils';

import styles from '../styles';

import { connect } from 'react-redux';
import { recoverPasswordRequest } from '../../../store/actions';

class PasswordForm extends Component {
  constructor(props) {
    super(props);
  }

  send = () => {
    Keyboard.dismiss();
    const { recoverPasswordRequest, email } = this.props;
    recoverPasswordRequest({ email });
  }

  renderInput = ({ input, label, type, meta: { touched, error }, ...custom }) => {
    const { width, required } = custom;
    const { value, onChange, onBlur } = input;
    let hasError = false;
    if (touched && error !== undefined) {
      hasError = true;
    }
    return (
      <View style={[styles.field, { width: width }]}>
        <Item underline stackedLabel error={hasError}>
          <Label>{label}:{required ? <Text danger>**</Text> : null}</Label>
          <Input {...input}
            keyboardType="email-address"
            underlineColorAndroid="transparent"
            textContentType="emailAddress"
            autoCapitalize="none"
            returnKeyType="done"
            blurOnSubmit
            onSubmitEditing={() => { this.send() }} />
        </Item>
        {hasError ? <Text style={styles.fieldErrorMessage}>{error}</Text> : null}
      </View>
    );
  }

  render() {
    const { handleSubmit, reset, submitting } = this.props;
    return (
      <Card style={styles.card}>
        <CardItem>
          <Body>
            <Text>
              Digite o seu email abaixo para enviarmos uma nova senha.
            </Text>
            <View style={styles.fieldsContainer}>

              <Field label="Email:" name="email" component={this.renderInput} width="100%" required
                validate={[validateRequired, validateEmail]} parse={value => value ? value.trim() : value} />

            </View>

            <View style={styles.buttonsBar}>
              <Button disabled={submitting} onPress={reset}
                light style={[styles.button, { flex: 1 }]}>
                <Text>Limpar</Text>
              </Button>
              <Button disabled={submitting} onPress={handleSubmit(this.send)}
                primary style={[styles.button, { flex: 2, marginLeft: 15 }]}>
                <Text>Enviar</Text>
              </Button>
            </View>

          </Body>
        </CardItem>
      </Card>
    );
  }
}



const selector = formValueSelector('recoverPassword');

const mapStateToProps = state => {
  const email = selector(state, 'email')
  return { email };
}

PasswordForm = reduxForm({ form: 'recoverPassword', touchOnBlur: true })(PasswordForm);
PasswordForm = connect(mapStateToProps, { recoverPasswordRequest })(PasswordForm);

export default PasswordForm;
