import React, { Component } from 'react';
import { View, Keyboard, Platform, Image, Dimensions } from 'react-native';
import { Content, Item, Input, Label, Body, Button, Text, Card, CardItem, Icon, Form, Picker, Thumbnail, Header, Title, Left, Right } from 'native-base';
import { Field, reduxForm, formValueSelector, change } from 'redux-form';
import { validateRequired, formatFileSize } from '../../../utils';

import { connect } from 'react-redux';
import { createDocumentoRequest } from '../../../store/actions';

import styles from '../styles';
import material from '../../../../native-base-theme/variables/material';
import { item, typografy } from '../../../styles';

const docThumb = require('../../../../assets/imgs/document.jpg');
const videoThumb = require('../../../../assets/imgs/video.jpg');
const addThumb = require('../../../../assets/imgs/add-file.jpg');

const { width: winWidth, height: winHeight } = Dimensions.get('window');

import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';;
import * as Permissions from 'expo-permissions';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

import { MAX_DOC_IMAGE_PIXELS, MAX_FILE_SIZE, MAX_FILE_SIZE_READABLE } from '../../../config';

/**
 * body: {
        "tipo_documento": 1,
        "diretorio": 1,
        "referencia": "Página 1",
        "arquivo": (escolhe o arquivo),
        "meta_dados": {"teste": "meta-dados"},
        "comentario": "Comentario",
    }
 * 
 */

/**
 * PickerResult
 * {
 "cancelled": false,
 "duration": 23833.333984375,
 "height": 1080,
 "type": "video",
 "uri": "file:///var/mobile/Containers/Data/Application/FBF3C4F0-6C83-43F4-882F-F1BD008CED5B/Library/Caches/ExponentExperienceData/%2540tattivitorino%252Fatex-mob-ce/ImagePicker/FF7B6DD2-7EE3-4EEB-855F-70A5F59681B5.mov",
 "width": 1920,
}
 */

const formData = [
  {
    name: 'tipo_documento',
    label: 'Tipo do Documento',
    width: '100%',
    required: true,
    validate: [validateRequired],
    next: true,
    inputType: 'select'
  },
  {
    name: 'referencia',
    label: 'Descrição:',
    width: '100%',
    required: false,
    validate: false,
    next: true,
    keyboardType: 'default',
    textContentType: 'none',
    autoCapitalize: 'sentences',
    inputType: 'text'
  }
];

class DocsAddForm extends Component {
  constructor(props) {
    super(props)
    this.inputs = {};
    this.state = {
      pickedFile: null,
      success: this.props.success,
      pickError: null
    };
    this._send = this._send.bind(this);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let newState = null;

    if (nextProps.success !== prevState.success) {
      if (!newState) newState = {};
      newState.success = nextProps.success;
      if (newState.success === true) {
        newState.pickedFile = null;
      }
    }
    return newState;
  }

  componentDidUpdate(prevProps, prevState) {
    //console.log('did update', prevState, this.state);
    if (prevState.success !== this.state.success && this.state.success === true) {
      this.props.reset();
    }
  }

  _send(values) {
    const { diretorio_documentos } = this.props.cliente;
    const data = { ...values, ...this.state.pickedFile, diretorio_documentos }
    this.props.createDocumentoRequest(data);

    if (this.state.pickedFile.source === 'camera') {
      MediaLibrary.createAssetAsync(this.state.pickedFile.uri)
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          console.log(err);
        });
    }
  }

  _pickImage = async () => {
    try {
      const { status: cameraRollPerm } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (cameraRollPerm === 'granted') {
        let options = {
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          quality: 1,
          allowsEditing: false,
          //aspect: [1, 1],
          //base64: true,
          //exif: true,
        }

        let pickerResult = await ImagePicker.launchImageLibraryAsync(options);
        this._handlePicked({ ...pickerResult, source: 'cameraRoll' });
      }
    } catch (e) {
      console.log('CAMERAROLL ERROR: ', e);
      //this.setState({ pickError: 'Erro ao coletar imagem!' })
    }
  }

  _takePhoto = async () => {
    try {
      const { status: cameraPerm } = await Permissions.askAsync(Permissions.CAMERA);
      const { status: cameraRollPerm } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (cameraPerm === 'granted' && cameraRollPerm === 'granted') {
        let options = {
          quality: 1,
          allowsEditing: false,
          //aspect: [1, 1],
          //base64: true,
          //exif: true
        }

        let pickerResult = await ImagePicker.launchCameraAsync(options);
        this._handlePicked({ ...pickerResult, source: 'camera' });
      }
    } catch (e) {
      console.log('CAMERA ERROR: ', e);
      //this.setState({ pickError: 'Erro ao tirar foto!' })
    }
  }

  _pickDocument = async () => {
    try {
      let options = {
        type: '*/*'
      }
      let pickerResult = await DocumentPicker.getDocumentAsync(options);
      this._handlePicked({ ...pickerResult, source: 'document' });
    } catch (e) {
      console.log('DOCUMENTPICKER ERROR: ', e);

      //this.setState({ pickError: 'Erro ao escolher documento' })
    }
  }

  _handlePicked = async pickerResult => {
    try {
      console.log(pickerResult);

      if (pickerResult.cancelled) return;
      if (pickerResult.type === 'cancel') return;
      let uriParts = [];

      if (pickerResult.name) {
        uriParts = pickerResult.name.split('.');
      } else {
        uriParts = pickerResult.uri.split('.');
      }

      let extension = uriParts[uriParts.length - 1];
      extension = extension.toLowerCase()
      let imageManipulated = null;

      if (extension === 'jpg' || extension === 'jpeg' || extension === 'png') {
        //manipulate the image 
        const isVertical = pickerResult.height > pickerResult.width;
        const resizeOption = isVertical ? { height: MAX_DOC_IMAGE_PIXELS } : { width: MAX_DOC_IMAGE_PIXELS };
        const isSourceBigger = pickerResult.width > MAX_DOC_IMAGE_PIXELS || pickerResult.height > MAX_DOC_IMAGE_PIXELS;
        if (isSourceBigger) {
          imageManipulated = await ImageManipulator.manipulateAsync(
            pickerResult.uri,
            [{ resize: resizeOption }],
            {
              compress: Platform.OS === 'ios' ? 0.5 : 0.8,
              format: extension === 'png' ? 'png' : 'jpeg'
            }
          );
        }
      }

      let result = { ...pickerResult, extension };
      if (imageManipulated) {
        result = { ...pickerResult, ...imageManipulated, extension };
      }

      if (!result.size) {
        const fileInfo = await FileSystem.getInfoAsync(result.uri, {
          size: true
        });
        result.size = fileInfo.size;
      }
      result.sizeReadable = formatFileSize(result.size, 2);

      console.log('RESULT: ', result);

      if (result.size > MAX_FILE_SIZE) {
        throw new Error(`O Arquivo escolhido tem ${result.sizeReadable} e é maior que o máximo de ${MAX_FILE_SIZE_READABLE} MB permitidos!`);
      }

      this.setState({
        pickedFile: result,
        pickError: null
      })
      this.props.change('arquivo', result.uri)

    } catch (e) {
      console.log(e)
      this.setState({ pickError: e.message })
    }
  }

  _removeFile = () => {
    this.props.change('arquivo', null);
    this.setState({
      pickedFile: null,
      pickError: null
    })
  }

  _renderFile = () => {
    const { pickedFile } = this.state;
    if (!pickedFile) return null;

    if (pickedFile.type === 'image') return (<Thumbnail square style={{ width: 120, height: 120 }} source={{ uri: pickedFile.uri }} />);
    if (pickedFile.type === 'video') return (<Icon name="md-videocam" style={[{ fontSize: 50, color: material.brandSecondary }]} />);
    if (pickedFile.type === 'success') return (<Text secondary style={{}}>{pickedFile.name}</Text>);
  }

  _renderError = () => {
    const { pickError } = this.state;
    if (!pickError) return null;
    return (
      <View style={{ padding: 15, backgroundColor: material.brandDanger, alignItems: 'center', marginBottom: 20 }}>
        <Text style={{ color: '#fff' }}>{pickError}</Text>
      </View>
    );
  }

  _getInput = (input, custom) => {
    const { next, index, keyboardType, textContentType, autoCapitalize, inputType } = custom;
    const i = parseInt(index);
    const { onChange, value } = input;

    switch (inputType) {

      case 'select':
        return (
          <Picker
            ref={ref => this.inputs[index] = ref}
            mode="dropdown"
            renderHeader={backAction =>
              <Header style={{ backgroundColor: material.brandSecondary }}>
                <Left style={{ width: 40 }}>
                  <Button transparent onPress={backAction}>
                    <Icon name="arrow-back" style={{ color: "#fff" }} />
                  </Button>
                </Left>
                <Body style={{ flexGrow: 1 }}>
                  <Title style={{ color: "#fff" }}>Selecione uma opção:</Title>
                </Body>
                <Right style={{ width: 40 }} />
              </Header>}
            iosIcon={<Icon name="arrow-dropdown" style={{ position: 'absolute', right: 0 }} />}
            selectedValue={value}
            onValueChange={onChange}
            style={{ width: winWidth - 50 }}
          >
            {this.props.documentoTipoList.map(item => <Picker.Item label={item.nome} value={item.id} key={item.id} />)}
          </Picker>
        )

      default:
        return (
          <Input {...input}
            ref={ref => this.inputs[i] = ref}
            keyboardType={keyboardType}
            textContentType={textContentType}
            autoCapitalize={autoCapitalize ? autoCapitalize : "none"}
            returnKeyType={next ? "next" : "done"}
            onFocus={() => { }}
            blurOnSubmit={next ? false : true}
            onSubmitEditing={() => { }} />
        );
    }
  }

  _renderInput = ({ input, label, type, meta: { touched, error }, ...custom }) => {
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
          {this._getInput(input, custom)}
        </Item>
        {hasError ? <Text style={styles.fieldErrorMessage}>{error}</Text> : null}
      </View>
    );
  }

  render() {
    const { handleSubmit, submitting } = this.props;
    const { pickedFile } = this.state;

    return (
      <Content disableKBDismissScroll={true}>

        <View style={{ padding: 15 }}>

          <Card>
            <CardItem header>
              <Text style={styles.cardHeaderTitle} secondary>Documento</Text>
            </CardItem>
            <CardItem>
              <Body>
                <Text medium>Campos marcados com <Text danger>**</Text> são obrigatórios</Text>
                <Text medium>O tamanho máximo de arquivos para upload é de <Text danger>{MAX_FILE_SIZE_READABLE} MB</Text></Text>

                <View style={[styles.fieldsContainer]}>

                  <Field label="Tipo do Documento"
                    name="tipo_documento"
                    width="100%"
                    required
                    component={this._renderInput}
                    validate={[validateRequired]}
                    inputType="select"
                    index={0} />

                  <Field label="Referencia"
                    name="referencia"
                    width="100%"
                    component={this._renderInput}
                    inputType="text"
                    keyboardType={'default'}
                    textContentType={'none'}
                    autoCapitalize={'sentences'}
                    index={1} />

                </View>

                <View style={[styles.buttonsBar, { flexDirection: 'row', justifyContent: 'center', marginBottom: 20, marginTop: 10 }]}>

                  <Button primary onPress={this._pickImage} style={{ marginRight: 10 }}>
                    <Icon style={{}} name="md-photos" />
                  </Button>

                  <Button primary onPress={this._takePhoto} style={{ marginRight: 10 }}>
                    <Icon style={{}} name="camera" />
                  </Button>

                  <Button primary onPress={this._pickDocument}>
                    <Icon type="AntDesign" style={{}} name="filetext1" />
                  </Button>

                </View>

                {pickedFile && <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                  <View style={{ width: 200, alignItems: 'center' }}>
                    <View>
                      {this._renderFile()}
                    </View>
                    <View style={{ paddingVertical: 5, alignItems: 'center' }}>
                      <Text medium>Tam.: {pickedFile.sizeReadable}</Text>
                      <Text medium>Ext.: {pickedFile.extension}</Text>
                    </View>
                  </View>
                  <View>
                    <Button danger onPress={this._removeFile}>
                      <Icon name="ios-trash" />
                    </Button>
                  </View>
                </View>}

                {/* pickedFile && <View style={{ padding: 10, width: '100%', alignItems: 'center' }}>
                  {Object.keys(pickedFile).map(key => {
                    if (key !== 'uri') return (<Text key={key.toString()}>{key}: {pickedFile[key]}</Text>)
                  })}
                </View> */}

                {this._renderError()}

              </Body>
            </CardItem>
          </Card>

          <View style={[styles.buttonsBar, { flexDirection: 'column' }]}>
            <Button secondary style={[styles.button, { width: '60%', alignSelf: 'center' }]}
              disabled={!pickedFile || submitting}
              onPress={handleSubmit(this._send)}>
              <Text>Salvar Documento</Text>
            </Button>
          </View>

        </View>

      </Content>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const { cliente } = state.clientes;
  const { documentoTipoList, success } = state.documentos;
  const tipo_documento = documentoTipoList[0].id;
  return { cliente, documentoTipoList, success, initialValues: { tipo_documento } };
}

DocsAddForm = reduxForm({
  form: 'docsadd',
  touchOnBlur: false,
  onSubmitSuccess: (result, dispatch, props) => { },
  onSubmitFail: (errors, dispatch, submitError, props) => { }
})(DocsAddForm);
DocsAddForm = connect(mapStateToProps, {
  change,
  createDocumentoRequest
})(DocsAddForm)
export default DocsAddForm;