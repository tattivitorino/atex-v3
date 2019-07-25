import React, { Component } from 'react';
import { View, Keyboard, Dimensions, TouchableOpacity, Modal, FlatList } from 'react-native';
import { Container, Content, Item, Input, Label, Header, Left, Right, Body, Button, Text, Card, CardItem, Icon, Form, Title, ListItem, Picker } from 'native-base';
import { Field, reduxForm, change } from 'redux-form';

import { connect } from 'react-redux';
import {
  createClienteRequest,
  updateClienteRequest,
  searchProfissaoText
} from '../../../store/actions';
import { filterProfissoesByText, getProfissaoById } from '../../../store/selectors';

import { fetchAddressByCep } from '../../../api/external.api';
import { formatString, reverseDate } from '../../../utils';

import styles from '../styles';
import material from '../../../../native-base-theme/variables/material';

import { formData } from './formData';
const { width: winWidth } = Dimensions.get('window');

class ClienteForm extends Component {

  constructor(props) {
    super(props);

    this.inputs = {};
    this.activeInputIndex = 0;
    this.dispatchNext = false;
    this.scrollRef;

    this.state = {
      modalVisible: false,
      itemSelected: this.props.itemSelected
    }
  }

  handleFocus = index => {
    this.activeInputIndex = index;
  }

  focusNext = () => {
    const input = this.inputs[this.activeInputIndex + 1];
    if (input._root) input._root.focus()
  }

  getAddressByCep = cep => {
    fetchAddressByCep(cep)
      .then(res => {
        this.props.change('logradouro', res.logradouro);
        this.props.change('bairro', res.bairro);
        this.props.change('cidade', res.localidade);
        this.props.change('estado', res.uf);
      })
      .catch(err => {
        console.log(JSON.stringify(err));
      })
  }

  onFieldChange = (event, newValue, previousValue, name) => {
    if (name === 'cep') {
      if (newValue.length === 8) this.getAddressByCep(newValue)
    }
  }

  onChangeProfissaoText = text => {
    const { searchProfissaoText } = this.props;
    searchProfissaoText(text)
  }

  renderListItem = ({ item, index }) => {
    return (
      <ListItem button onPress={() => {
        this.props.change('profissao', item.id);
        this.props.searchProfissaoText('')
        this.setState({ itemSelected: item, modalVisible: false })
      }}>
        <Left>
          <Text>{item.nome}</Text>
        </Left>
      </ListItem>
    )
  }

  getInput = (input, custom) => {
    //console.log(input)
    const { value, onChange } = input;
    const { next, index, keyboardType, textContentType, autoCapitalize, maxLength, editable, inputType, options } = custom;
    const i = parseInt(index);

    switch (inputType) {

      case 'select':
        const listOptions = this.props[options];
        return (
          <Picker
            ref={ref => this.inputs[i] = ref}
            mode="dropdown"
            selectedValue={value}
            onValueChange={onChange}
            style={{ width: winWidth - 50 }}
            textStyle={{ fontSize: 16, color: '#000' }}
            iosIcon={<Icon name="arrow-dropdown" style={{ position: 'absolute', right: 0 }} />}
          >
            <Picker.Item label={'...'} value={null} />
            {listOptions.map(item => <Picker.Item label={item.nome} value={item.id} key={item.id} />)}
          </Picker>
        )

      case 'autocomplete':
        return (
          null
        )

      default:
        return (
          <Input {...input}
            ref={ref => this.inputs[i] = ref}
            editable={editable}
            underlineColorAndroid="transparent"
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize ? autoCapitalize : "none"}
            maxLength={maxLength ? maxLength : null}
            returnKeyType={"done"}
            onFocus={event => {
              this.handleFocus(i)
            }}
            blurOnSubmit={true}
            onSubmitEditing={() => {
              this.dispatchNext = true;
            }}
            onEndEditing={() => {
              //if (next && this.dispatchNext) this.focusNext();
              this.dispatchNext = false;
            }} />
        )
    }
  }

  getAutocomplete = (input, custom) => {
    const { value, onChange } = input;
    const { next, index, keyboardType, textContentType, autoCapitalize, maxLength, editable, inputType, options } = custom;
    const i = parseInt(index);

    return (
      <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'center', flex: 1 }}
        onPress={() => {
          this._setModalVisible(true)
        }}>

        <View style={{ flexGrow: 1, justifyContent: 'center', alignItems: 'flex-start', paddingLeft: 10 }}>

          <Text style={{ width: winWidth - 125 }} numberOfLines={1} ellipsizeMode={'tail'}>{this.state.itemSelected ? this.state.itemSelected.nome : 'Buscar Profissão...'}</Text>

        </View>

        <View style={{ width: 50 }}>
          <Button transparent onPress={() => { }}>
            <Icon dark name="search" />
          </Button>
        </View>

      </TouchableOpacity>
    );

  }

  renderInput = ({ input, label, type, meta: { touched, error }, ...custom }) => {
    //console.log(input, custom);
    const { width, required, hint, inputType } = custom;
    let hasError = false;
    if (touched && error !== undefined) {
      hasError = true;
    }
    return (
      <View style={[styles.field, { width: width }]}>
        <Item stackedLabel error={hasError}>
          <Label>{label}: {required ? <Text style={{ fontSize: 13 }} danger>**</Text> : null}</Label>
          {hint ? <Text medium style={styles.hint}>{hint}</Text> : null}
          {inputType === 'autocomplete' ? this.getAutocomplete(input, custom) : this.getInput(input, custom)}
        </Item>
        {hasError ? <Text style={styles.fieldErrorMessage}>{error}</Text> : null}
      </View>
    );
  }

  send = values => {
    Keyboard.dismiss();
    const { createClienteRequest, updateClienteRequest, formType } = this.props;
    if (formType === 'add') createClienteRequest(values)
    else updateClienteRequest(values);
  }

  _setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  render() {
    const { handleSubmit, submitting, valid, profissaoQueryList, profissaoList } = this.props;
    return (
      <>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this._setModalVisible(false);
          }}>
          <Container>
            <Header style={{ backgroundColor: material.brandSecondary }}>
              <Left style={{ width: 40 }}>
                <Button transparent onPress={() => {
                  this._setModalVisible(false);
                }}>
                  <Icon name="arrow-back" style={{ color: "#fff" }} />
                </Button>
              </Left>
              <Body style={{ flexGrow: 1 }}>
                <Title style={{ color: "#fff" }}>Buscar Profissão</Title>
              </Body>
              <Right style={{ width: 40 }} />
            </Header>
            <Card style={{ margin: 0, padding: 5 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                <Item regular style={{ flex: 1 }}>
                  <Icon name="search" />
                  <Input placeholder='Digite a Profissão'
                    keyboardType="default"
                    textContentType="none"
                    returnKeyType="done"
                    clearButtonMode="while-editing"
                    autoCapitalize={'none'}
                    onChangeText={this.onChangeProfissaoText} />
                </Item>
              </View>
            </Card>
            <View style={{ padding: 10 }}>
              <Text>Lista de profissões com {profissaoList.length} registros.</Text>
            </View>
            <FlatList
              keyboardDismissMode={'on-drag'}
              keyboardShouldPersistTaps={'handled'}
              data={profissaoQueryList}
              extraData={this.props}
              renderItem={this.renderListItem}
              keyExtractor={item => item.id.toString()}
              ListEmptyComponent={<View style={{ padding: 20, alignItems: 'center' }}>
                <Text></Text>
              </View>}
            />
          </Container>
        </Modal>

        <Content
          innerRef={c => this.scrollRef = c}
          viewIsInsideTabBar={true}
          disableKBDismissScroll={true}
          enableOnAndroid={true}>
          <View style={{ padding: 15 }}>

            <Card>
              <CardItem header>
                <Text style={styles.cardHeaderTitle} secondary>Dados Pessoais</Text>
              </CardItem>
              <CardItem>
                <Body>
                  <Text medium>Campos marcados com <Text danger>**</Text> são obrigatórios</Text>
                  <View style={[styles.fieldsContainer]}>
                    {formData.map((field, index) => {

                      if (field.group === 'dados_pessoais') {

                        const { label, name, disabledOnEdit, width, required, hint, validate, next, keyboardType, textContentType, parse, format, autoCapitalize, maxLength, inputType, options } = field;

                        if (inputType === 'select') {
                          return (
                            <Field
                              key={`input_${index}`}
                              label={label}
                              name={name}
                              width={width}
                              required={required ? required : false}
                              component={this.renderInput}
                              validate={validate ? validate : null}
                              inputType="select"
                              index={index}
                              options={options ? options : null} />
                          );
                        }

                        return (
                          <Field
                            key={`input_${index}`}
                            label={label}
                            name={name}
                            editable={disabledOnEdit && this.props.formType == 'edit' ? false : true}
                            parse={value => {
                              if (parse == 'trim') return value ? value.trim() : value
                              return value;
                            }}
                            format={value => {
                              switch (format) {
                                case 'cpf':
                                case 'dt-br':
                                case 'ddd-phone':
                                case 'ddd-mobile':
                                  if (value === null || value === '') return null;
                                  return formatString(value, format);
                                default:
                                  return value;
                              }
                            }}
                            width={width}
                            required={required ? required : false}
                            hint={hint ? hint : false}
                            component={this.renderInput}
                            validate={validate ? validate : null}
                            next={next}
                            index={index}
                            keyboardType={keyboardType}
                            textContentType={textContentType}
                            autoCapitalize={autoCapitalize}
                            maxLength={maxLength}
                            onChange={this.onFieldChange}
                            inputType={inputType}
                            options={options ? options : null} />
                        );
                      }

                    })}
                  </View>
                </Body>
              </CardItem>
              <CardItem header>
                <Text style={styles.cardHeaderTitle} secondary>Endereço</Text>
              </CardItem>
              <CardItem>
                <Body>
                  <View style={[styles.fieldsContainer]}>
                    {formData.map((field, index) => {

                      if (field.group === 'endereco') {

                        const { label, name, disabledOnEdit, width, required, hint, validate, next, keyboardType, textContentType, parse, format, autoCapitalize, maxLength, inputType, options } = field;

                        if (inputType === 'select') {
                          return (
                            <Field
                              key={`input_${index}`}
                              label={label}
                              name={name}
                              width={width}
                              required={required ? required : false}
                              component={this.renderInput}
                              validate={validate ? validate : null}
                              inputType="select"
                              index={index}
                              options={options ? options : null} />
                          );
                        }

                        return (
                          <Field
                            key={`input_${index}`}
                            label={label}
                            name={name}
                            editable={disabledOnEdit && this.props.formType == 'edit' ? false : true}
                            parse={value => {
                              if (parse == 'trim') return value ? value.trim() : value
                              return value;
                            }}
                            format={value => {
                              switch (format) {
                                case 'cpf':
                                case 'dt-br':
                                case 'ddd-phone':
                                case 'ddd-mobile':
                                  if (value === null || value === '') return null;
                                  return formatString(value, format);
                                default:
                                  return value;
                              }
                            }}
                            width={width}
                            required={required ? required : false}
                            hint={hint ? hint : false}
                            component={this.renderInput}
                            validate={validate ? validate : null}
                            next={next}
                            index={index}
                            keyboardType={keyboardType}
                            textContentType={textContentType}
                            autoCapitalize={autoCapitalize}
                            maxLength={maxLength}
                            onChange={this.onFieldChange}
                            inputType={inputType}
                            options={options ? options : null} />
                        );
                      }

                    })}
                  </View>
                </Body>
              </CardItem>
            </Card>

            <View style={[styles.buttonsBar, { flexDirection: 'column' }]}>
              <Button secondary style={[styles.button, { width: '60%', alignSelf: 'center' }]}
                disabled={!valid || submitting}
                onPress={handleSubmit(this.send)}>
                <Text>Salvar Dados</Text>
              </Button>
            </View>

            {!valid ? <View style={{ padding: 5 }}>
              <Text danger style={{ alignSelf: 'center' }}>Verifique e preencha todos os campos obrigatórios</Text>
            </View> : null}

          </View>
        </Content>

      </>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { cliente, nacionalidadeList, estadoCivilList, sexoList, profissaoList } = state.clientes;
  const { formType } = ownProps;
  const data_nascimento = cliente.data_nascimento ? reverseDate(cliente.data_nascimento) : null;
  const initValues = formType == 'edit' ? { ...cliente, data_nascimento } : null;
  const itemSelected = formType == 'edit' ? getProfissaoById(state) : null;

  const profissaoQueryList = filterProfissoesByText(state);

  return { cliente, nacionalidadeList, estadoCivilList, sexoList, profissaoList, profissaoQueryList, itemSelected, initialValues: initValues };
}

ClienteForm = reduxForm({
  form: 'cliente',
  touchOnBlur: false,
  onSubmitSuccess: (result, dispatch, props) => { },
  onSubmitFail: (errors, dispatch, submitError, props) => { }
})(ClienteForm);
ClienteForm = connect(mapStateToProps, {
  change,
  createClienteRequest,
  updateClienteRequest,
  searchProfissaoText
})(ClienteForm)
export default ClienteForm;