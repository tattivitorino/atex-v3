import React, { Component } from 'react';
import { View, Keyboard } from 'react-native';
import { Item, Input, Label, Body, Button, Text, Card, CardItem, Textarea } from 'native-base';
import moment from 'moment';
import DatePicker from 'react-native-datepicker';
import { Field, reduxForm, formValueSelector, change } from 'redux-form';
import { validateRequired } from '../../../utils';

import { connect } from 'react-redux';
import { createAtendimentoRequest, updateAtendimentoRequest } from '../../../store/actions';

import material from '../../../../native-base-theme/variables/material';
import styles from '../styles';

const formData = [
  {
    name: 'datetime',
    label: 'Data e Hora',
    width: '100%',
    required: true,
    validate: [validateRequired],
    next: false,
    keyboardType: 'default',
    textContentType: 'none',
    autoCapitalize: 'none',
    inputType: 'datetime'
  },
  {
    name: 'titulo',
    label: 'Título',
    width: '100%',
    required: true,
    validate: [validateRequired],
    next: true,
    keyboardType: 'default',
    textContentType: 'none',
    autoCapitalize: 'words',
    inputType: 'text'
  },
  {
    name: 'observacoes',
    label: 'Observações',
    width: '100%',
    next: false,
    keyboardType: 'default',
    textContentType: 'none',
    autoCapitalize: 'sentences',
    inputType: 'textarea'
  }
];

class AgendaForm extends Component {

  constructor(props) {
    super(props);
    this.inputs = {};

    this.activeInputIndex = 0;
    this.nextDisabled = false;
    this.previousDisabled = true;

    this.state = {
      date: this.props.datetime,
      minDate: moment().format('DD/MM/YYYY HH:mm')
    }
  }

  focusPrevious = () => {
    if (this.previousDisabled) return;
    const input = this.inputs[this.activeInputIndex - 1];
    input._root.focus();
  }

  focusNext = () => {
    if (this.nextDisabled) return;
    const input = this.inputs[this.activeInputIndex + 1];
    input._root.focus();
  }

  handleFocus = index => {
    this.activeInputIndex = index;
    this.nextDisabled = index === formData.length - 1;
    this.previousDisabled = index === 0;
  }

  getInput = (input, custom) => {
    const { next, index, keyboardType, textContentType, autoCapitalize, inputType } = custom;
    const i = parseInt(index);

    switch (inputType) {
      case 'textarea':
        return (
          <Textarea {...input}
            ref={input => this.inputs[i] = input}
            rowSpan={5}
            keyboardType={keyboardType}
            textContentType={textContentType}
            autoCapitalize={autoCapitalize ? autoCapitalize : "none"}
            onFocus={() => {
              this.handleFocus(i)
            }}
            returnKeyType={'default'}
            blurOnSubmit={false}
            onSubmitEditing={() => { }}
            style={{ width: '100%' }} />
        )

      case 'datetime':
        return (
          <DatePicker
            ref={input => this.inputs[i] = input}
            style={{ width: '100%' }}
            date={this.state.date}
            minDate={this.state.minDate}
            mode={inputType}
            format="DD/MM/YYYY HH:mm"
            confirmBtnText="Confirmar"
            cancelBtnText="Cancelar"
            is24Hour={true}
            minuteInterval={10}
            customStyles={{
              dateInput: {
                borderWidth: 0,
                alignItems: 'flex-start',
                paddingLeft: 10
              },
              dateText: {
                fontSize: 16
              },
              btnTextConfirm: {
                color: material.brandPrimary
              },
              btnTextCancel: {
                color: material.brandMedium
              }
            }}
            onDateChange={date => {
              this.setState({ date })
              this.props.change('datetime', date);
            }}
          />
        )

      default:
        return (
          <Input {...input}
            ref={input => this.inputs[i] = input}
            keyboardType={keyboardType}
            textContentType={textContentType}
            autoCapitalize={autoCapitalize ? autoCapitalize : "none"}
            returnKeyType={next ? "next" : "done"}
            onFocus={() => {
              this.handleFocus(i)
            }}
            blurOnSubmit={next ? false : true}
            onSubmitEditing={() => {
              if (next) this.focusNext();
            }} />
        );
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

        const { label, name, width, required, hint, validate, next, keyboardType, textContentType, autoCapitalize, maxLength, inputType } = field;

        return (
          <Field
            key={`input_${index}`}
            label={label}
            name={name}
            parse={value => {
              return value;
            }}
            format={value => {
              return value;
            }}
            width={width}
            inputType={inputType}
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
            onChange={this.onFieldChange} />
        );
      }

    })
  }

  send = values => {
    Keyboard.dismiss();
    const { createAtendimentoRequest, updateAtendimentoRequest, formType } = this.props;
    if (formType == 'add') createAtendimentoRequest(values)
    else updateAtendimentoRequest(values);
  }

  render() {
    const { handleSubmit, submitting } = this.props;
    return (
      <Card>
        <CardItem header>
          <Text style={styles.cardHeaderTitle} secondary>Atendimento</Text>
        </CardItem>

        <CardItem>
          <Body>
            <Text medium>Campos marcados com <Text danger>**</Text> são obrigatórios</Text>

            <View style={[styles.fieldsContainer]}>
              {formData.map((field, index) => {

                const { label, name, width, required, hint, validate, next, keyboardType, textContentType, autoCapitalize, maxLength, inputType } = field;

                return (
                  <Field
                    key={`input_${index}`}
                    label={label}
                    name={name}
                    parse={value => {
                      return value;
                    }}
                    format={value => {
                      return value;
                    }}
                    width={width}
                    inputType={inputType}
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
                    onChange={this.onFieldChange} />
                );

              })}
            </View>

            <View style={[styles.buttonsBar, { flexDirection: 'column' }]}>
              <Button secondary style={[styles.button, { width: '60%', alignSelf: 'center' }]}
                disabled={submitting}
                onPress={handleSubmit(this.send)}>
                <Text>Salvar Dados</Text>
              </Button>
            </View>

          </Body>
        </CardItem>
      </Card>
    )
  }
}


const mapStateToProps = (state, ownProps) => {
  const { atendimento } = state.atendimentos;
  const { id, data, observacoes, titulo } = atendimento;
  const { formType } = ownProps;
  let datetime = formType === 'edit' ? moment(data).format('DD/MM/YYYY HH:mm') : moment().format('DD/MM/YYYY HH:mm');
  const initValues = formType === 'edit' ? { id, datetime, observacoes, titulo } : { datetime };
  return { atendimento, datetime, initialValues: initValues };
}

AgendaForm = reduxForm({
  form: 'agenda',
  touchOnBlur: false,
  onSubmitSuccess: (result, dispatch, props) => { },
  onSubmitFail: (errors, dispatch, submitError, props) => { }
})(AgendaForm);

AgendaForm = connect(mapStateToProps, {
  change,
  createAtendimentoRequest,
  updateAtendimentoRequest
})(AgendaForm);
export default AgendaForm;