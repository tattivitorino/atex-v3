import React, { Component } from 'react';
import { View, Keyboard, StyleSheet, InputAccessoryView } from 'react-native';
import { Content, Item, Input, Label, Body, Button, Text, Card, CardItem, Icon } from 'native-base';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { TextInputMask } from 'react-native-masked-text'
import { validateEmail, validateRequired } from '../../../utils';

//import styles from '../styles';

import { connect } from 'react-redux';
import { updateClienteRequest } from '../../../store/actions';

const formData = [
  {
    name: 'nome',
    label: 'Nome Completo',
    width: '100%',
    required: true,
    validate: [validateRequired],
    next: true,
    keyboardType: 'default',
    textContentType: 'none',
    autoCapitalize: 'words',
    group: 'dados_pesoais'
  },
  {
    name: 'cpf',
    label: 'CPF',
    width: '100%',
    required: true,
    validate: [validateRequired],
    next: true,
    hint: 'Digite apenas números',
    mask: 'cpf',
    keyboardType: 'numeric',
    textContentType: 'none',
    group: 'dados_pesoais'
  },
  {
    name: 'rg',
    label: 'RG',
    width: '48%',
    required: true,
    validate: [validateRequired],
    next: true,
    hint: 'Digite apenas números',
    keyboardType: 'numeric',
    textContentType: 'none',
    group: 'dados_pesoais'
  },
  {
    name: 'data_nascimento',
    label: 'Data de Nasc.',
    width: '48%',
    required: true,
    validate: [validateRequired],
    next: true,
    hint: 'DD/MM/YYYY',
    mask: 'datetime',
    maskOptions: { format: 'DD/MM/YYYY' },
    keyboardType: 'numeric',
    textContentType: 'none',
    group: 'dados_pesoais'
  },
  {
    name: 'celular',
    label: 'DDD e Celular',
    width: '48%',
    required: true,
    validate: [validateRequired],
    next: true,
    hint: '(99) 99999 9999',
    mask: 'cel-phone',
    maskOptions: { maskType: 'BRL', withDDD: true, dddMask: '(99) ' },
    keyboardType: 'numeric',
    textContentType: 'none',
    group: 'dados_pesoais'
  },
  {
    name: 'telefone_fixo',
    label: 'DDD e Tel. Fixo',
    width: '48%',
    required: true,
    validate: [validateRequired],
    next: true,
    hint: '(22) 2222 2222',
    mask: 'cel-phone',
    maskOptions: { maskType: 'BRL', withDDD: true, dddMask: '(99) ' },
    keyboardType: 'numeric',
    textContentType: 'none',
    group: 'dados_pesoais'
  },
  {
    name: 'email',
    label: 'Email',
    width: '100%',
    required: true,
    validate: [validateRequired, validateEmail],
    next: true,
    keyboardType: 'email-address',
    textContentType: 'emailAddress',
    autoCapitalize: 'none',
    group: 'dados_pesoais'
  },
  {
    name: 'cep',
    label: 'CEP',
    width: '70%',
    required: true,
    validate: [validateRequired],
    next: true,
    hint: 'Digite o CEP e toque no botão ao lado para buscar o endereço.',
    mask: 'zip-code',
    keyboardType: 'numeric',
    textContentType: 'none',
    group: 'endereco'
  },
  {
    name: 'logradouro',
    label: 'Endereço',
    width: '100%',
    required: true,
    validate: [validateRequired],
    next: true,
    keyboardType: 'default',
    textContentType: 'none',
    autoCapitalize: 'words',
    group: 'endereco'
  },
  {
    name: 'numero',
    label: 'Número',
    width: '33%',
    required: true,
    validate: [validateRequired],
    next: true,
    keyboardType: 'numeric',
    textContentType: 'none',
    group: 'endereco'
  },
  {
    name: 'complemento',
    label: 'Complemento',
    width: '63%',
    next: true,
    keyboardType: 'default',
    textContentType: 'none',
    group: 'endereco'
  },
  {
    name: 'bairro',
    label: 'Bairro',
    width: '100%',
    required: true,
    validate: [validateRequired],
    next: true,
    keyboardType: 'default',
    textContentType: 'none',
    group: 'endereco'
  },
  {
    name: 'cidade',
    label: 'Cidade',
    width: '63%',
    required: true,
    validate: [validateRequired],
    next: true,
    keyboardType: 'default',
    textContentType: 'none',
    group: 'endereco'
  },
  {
    name: 'estado',
    label: 'UF',
    width: '33%',
    required: true,
    validate: [validateRequired],
    keyboardType: 'default',
    textContentType: 'none',
    group: 'endereco'
  }
];

class ClienteAnteriorForm extends Component {
  constructor(props) {
    super(props);
    this.inputs = {};
    this.inputAccessoryViewID = 'numericView';
    this.state = {
      activeInputIndex: null,
      activeInputName: null,
      nextInputName: null,
      nextDisabled: false,
      previousDisabled: true,
      cpf: '',
      data_nascimento: '',
      celular: '',
      telefone_fixo: '',
      cep: ''
    }
  }

  handleFocus = (input, next, index) => {
    //console.log(input, next, index);
    index = parseInt(index);
    this.setState({
      activeInputIndex: index,
      activeInputName: input.name,
      nextInputName: next,
      nextDisabled: index == 13 ? true : false,
      previousDisabled: index == 0 ? true : false
    })
  }

  focusNext = (field) => {
    if (this.inputs[field]._root) this.inputs[field]._root.focus();
    else {
      const el = this.inputs[field].getElement();
      el._root.focus()
    }
  }

  getInput = (input, custom) => {
    //console.log(input)
    const { name } = input;
    const { next, index, mask, maskOptions } = custom;

    switch (input.name) {

      case 'total':
        return (
          <Input {...input}
            ref={input => this.inputs[name] = input}
            autoCapitalize="none"
            autoFocus
            clearButtonMode="while-editing"
            keyboardType="default"
            textContentType="none"
            returnKeyType={next ? "next" : "done"}
            blurOnSubmit={next ? false : true}
            onSubmitEditing={() => {
              if (next) this.focusNext(next);
            }} />
        )

      case 'nome':
      case 'logradouro':
      case 'complemento':
      case 'bairro':
      case 'cidade':
      case 'estado':
        return (
          <Input {...input}
            ref={input => this.inputs[name] = input}
            inputAccessoryViewID={this.inputAccessoryViewID}
            keyboardType="default"
            textContentType="none"
            returnKeyType={next ? "next" : "done"}
            onFocus={() => {
              this.handleFocus(input, next, index)
            }}
            blurOnSubmit={next ? false : true}
            onSubmitEditing={() => {
              if (next) this.focusNext(next);
            }} />
        )

      case 'cpf':
      case 'rg':
      case 'data_nascimento':
      case 'celular':
      case 'telefone_fixo':
      case 'cep':
      case 'numero':
        if (mask) {
          return (
            <TextInputMask {...input}
              type={mask}
              options={maskOptions ? maskOptions : false}
              ref={input => this.inputs[name] = input}
              value={this.state[name]}
              onChangeText={text => {
                this.setState({
                  [name]: text
                })
              }}
              inputAccessoryViewID={this.inputAccessoryViewID}
              keyboardType="numeric"
              textContentType="none"
              returnKeyType={next ? "next" : "done"}
              onFocus={() => {
                this.handleFocus(input, next, index)
              }}
              blurOnSubmit={next ? false : true}
              onSubmitEditing={() => {
                if (next) this.focusNext(next);
              }}
              customTextInput={Input} />
          );
        }
        return (
          <Input {...input}
            ref={input => this.inputs[name] = input}
            inputAccessoryViewID={this.inputAccessoryViewID}
            keyboardType="numeric"
            textContentType="none"
            returnKeyType={next ? "next" : "done"}
            onFocus={() => {
              this.handleFocus(input, next, index)
            }}
            blurOnSubmit={next ? false : true}
            onSubmitEditing={() => {
              if (next) this.focusNext(next);
            }} />
        )

      case 'email':
        return (
          <Input {...input}
            ref={input => this.inputs[name] = input}
            inputAccessoryViewID={this.inputAccessoryViewID}
            keyboardType="email-address"
            textContentType="emailAddress"
            autoCapitalize="none"
            returnKeyType={next ? "next" : "done"}
            blurOnSubmit={next ? false : true}
            onSubmitEditing={() => {
              if (next) this.focusNext(next);
            }} />
        )

      default:
        return <Input {...input} />
    }
  }

  renderInput = ({ input, label, type, meta: { touched, error }, ...custom }) => {
    //console.log(input, custom);
    const { width, required, hint } = custom;
    let hasError = false;
    if (touched && error !== undefined) {
      hasError = true;
    }
    return (
      <View style={[styles.field, { width: width }]}>
        <Item stackedLabel error={hasError}>
          <Label>{label}:{required ? <Text danger>**</Text> : null}</Label>
          {hint ? <Text medium style={styles.hint}>{hint}</Text> : null}
          {this.getInput(input, custom)}
        </Item>
        {hasError ? <Text style={styles.fieldErrorMessage}>{error}</Text> : null}
      </View>
    );
  }

  renderFormFields = group => {
    return formData.map((field, index) => {

      if (field.group == group) {

        const { label, name, width, required, mask, maskOptions, hint, validate, next, keyboardType, textContentType } = field;

        return (
          <Field
            key={`input_${index}`}
            label={label}
            name={name}
            width={width}
            required={required ? required : false}
            mask={mask ? mask : false}
            maskOptions={maskOptions ? maskOptions : false}
            hint={hint ? hint : false}
            component={this.renderInput}
            validate={validate ? validate : false}
            next={next}
            index={index}
            keyboardType={keyboardType}
            textContentType={textContentType} />
        );
      }

    })
  }

  renderError() { }

  send = values => {
    Keyboard.dismiss();
    console.log(values);
  }

  render() {
    const { handleSubmit, pristine, submitting } = this.props;
    return (
      <>
        <Content padder contentContainerStyle={{}}>

          <Card>
            <CardItem header>
              <Text primary>Dados Pessoais</Text>
            </CardItem>
            <CardItem>
              <Body>
                <Text medium>Preencha corretamente todos os campos abaixo</Text>
                <Text medium>Campos marcados com <Text danger>**</Text> são obrigatórios</Text>

                <View style={[styles.fieldsContainer]}>

                  <Field label="Nome Completo" name="nome" width="100%" required
                    component={this.renderInput} validate={[validateRequired]} next="cpf" index="0" />

                  <Field label="CPF" name="cpf" width="100%" required mask="cpf"
                    hint="Digite apenas números." component={this.renderInput}
                    validate={[validateRequired]} next="rg" index="1" />

                  <Field label="RG" name="rg" width="48%" required hint="Digite apenas números." component={this.renderInput} validate={[validateRequired]} next="data_nascimento" index="2" />

                  <Field label="Data Nasc." name="data_nascimento" width="48%" required mask="datetime" maskOptions={{ format: 'DD/MM/YYYY' }} hint="(DD/MM/YYYY)" component={this.renderInput} validate={[validateRequired]} next="celular" index="3" />

                  <Field label="DDD e Celular" name="celular" width="48%" required mask="cel-phone" maskOptions={{ maskType: 'BRL', withDDD: true, dddMask: '(99) ' }} hint="(99) 99999 9999" component={this.renderInput} validate={[validateRequired]} next="telefone_fixo" index="4" />

                  <Field label="DDD e Telefone Fixo" name="telefone_fixo" width="48%" required mask="cel-phone" maskOptions={{ maskType: 'BRL', withDDD: true, dddMask: '(99) ' }} hint="(22) 2222 2222" component={this.renderInput} validate={[validateRequired]} next="email" index="5" />

                  <Field label="Email" name="email" width="100%" component={this.renderInput} next="cep" index="6" />

                </View>

              </Body>
            </CardItem>
          </Card>

          <Card>
            <CardItem header>
              <Text primary>Endereço</Text>
            </CardItem>
            <CardItem>
              <Body>
                <Text medium>Preencha corretamente todos os campos abaixo</Text>
                <Text medium>Campos marcados com <Text danger>**</Text> são obrigatórios</Text>

                <View style={[styles.fieldsContainer]}>

                  <Field label="CEP" name="cep" width="70%" required mask="zip-code" hint="Digite o CEP e toque no botão ao lado para buscar o endereço." component={this.renderInput} validate={[validateRequired]} next="logradouro" index="7" />

                  <View style={[styles.field, { width: '29%', justifyContent: 'center', flexDirection: 'column' }]}>
                    <Button secondary style={{ alignSelf: 'center' }}>
                      <Icon name="search" />
                    </Button>
                  </View>

                  <Field label="Endereço" name="logradouro" width="100%" required component={this.renderInput} validate={[validateRequired]} next="numero" index="8" />

                  <Field label="Número" name="numero" width="33%" required component={this.renderInput} validate={[validateRequired]} next="complemento" index="9" />

                  <Field label="Complemento" name="complemento" width="63%" component={this.renderInput} next="bairro" index="10" />

                  <Field label="Bairro" name="bairro" width="100%" required component={this.renderInput} validate={[validateRequired]} next="cidade" index="11" />

                  <Field label="Cidade" name="cidade" width="63%" required component={this.renderInput} validate={[validateRequired]} next="estado" index="12" />

                  <Field label="Estado" name="estado" width="33%" required component={this.renderInput} validate={[validateRequired]} index="13" />

                </View>

              </Body>
            </CardItem>
          </Card>

          <View style={styles.buttonsBar}>
            <Button secondary style={[styles.button, { width: '60%', alignSelf: 'center', }]} disabled={submitting} onPress={handleSubmit(this.send)}>
              <Text>Salvar Dados</Text>
            </Button>
          </View>

        </Content>
        <InputAccessoryView nativeID={this.inputAccessoryViewID}
          backgroundColor="#f4f4f4">
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row' }}>
              <Button disabled={this.state.nextDisabled} transparent primary
                onPress={() => {
                  this.focusNext(this.state.nextInputName);
                }}>
                <Icon type="AntDesign" name="down" />
              </Button>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Button transparent primary onPress={() => { Keyboard.dismiss(); }}>
                <Text>Fechar</Text>
              </Button>
            </View>
          </View>
        </InputAccessoryView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  form: {},
  fieldsContainer: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 20
  },
  field: {
    marginBottom: 15,
  },
  hint: {
    fontSize: 13,
    alignSelf: 'flex-start',
  },
  buttonsBar: {
    alignSelf: 'stretch',
    flexDirection: 'column'
  },
  button: {
    marginVertical: 15,
    justifyContent: 'center'
  },
  border: {
    borderColor: '#000',
    borderWidth: 1,
  }
});

const selector = formValueSelector('clienteAnterior');

const mapStateToProps = state => {
  const { clientes } = state;
  return { clientes };
}

ClienteAnteriorForm = reduxForm({ form: 'clienteAnterior', touchOnBlur: false })(ClienteAnteriorForm);
ClienteAnteriorForm = connect(mapStateToProps, { updateClienteRequest })(ClienteAnteriorForm)
export default ClienteAnteriorForm;