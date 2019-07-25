//https://www.figma.com/dictionary/aspect-ratio/

import React, { Component } from 'react';
import { View, StyleSheet, Dimensions, Image, Platform } from 'react-native';
import { Container, Content, Button, Text, Thumbnail } from 'native-base';
import BaseHeader from '../../../components/baseHeader';

import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';;
import * as Permissions from 'expo-permissions';

import Loader from '../../../components/common/loader';

import { connect } from 'react-redux';
import { uploadAvatarRequest } from '../../../store/actions';

const { width: winWidth, height: winHeight } = Dimensions.get('window');

class ImagePickerScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      type: '',
      itemId: null,
      images: [],
      saved: false
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    const itemId = navigation.getParam('itemId');
    const type = navigation.getParam('type');
    this.setState({
      itemId,
      type
    })
  }

  _pickImage = async () => {
    const { status: cameraRollPerm } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (cameraRollPerm === 'granted') {
      const { type } = this.state;

      let options = {
        allowsEditing: true,
        aspect: [1, 1],
        quality: Platform.OS === 'ios' ? 0 : 1,
        //base64: true,
        //exif: true,
        mediaTypes: ImagePicker.MediaTypeOptions.Images
      }

      if (type == 'documento') options.mediaTypes = ImagePicker.MediaTypeOptions.All;

      let pickerResult = await ImagePicker.launchImageLibraryAsync(options);
      this._handleImagePicked(pickerResult);
    }
  }

  _takePhoto = async () => {
    const { status: cameraPerm } = await Permissions.askAsync(Permissions.CAMERA);
    const { status: cameraRollPerm } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (cameraPerm === 'granted' && cameraRollPerm === 'granted') {
      let options = {
        allowsEditing: true,
        aspect: [1, 1],
        quality: Platform.OS === 'ios' ? 0 : 1,
        //base64: true,
        //exif: true
      }

      let pickerResult = await ImagePicker.launchCameraAsync(options);
      this._handleImagePicked(pickerResult);
    }
  }

  _handleImagePicked = async pickerResult => {
    //console.log(this.state.type);
    //console.log(pickerResult);
    if (pickerResult.cancelled) return;
    const { type } = this.state;
    if (type === 'avatar') {
      const imageManipulated = await ImageManipulator.manipulateAsync(
        pickerResult.uri,
        [{ resize: { width: 500 } }],
        { compress: Platform.OS === 'ios' ? 0 : 1 }
      );
      this.setState({
        images: [{ ...pickerResult, ...imageManipulated }]
      })
    } else {
      this.setState({
        images: [...this.state.images, pickerResult]
      })
    }
  }

  _saveImages = () => {
    const { type, images, itemId } = this.state;
    const { id } = this.props.cliente;
    if (type === 'avatar') {
      const image = images[0];
      this.props.uploadAvatarRequest({ ...image, id })
    }
  }

  _renderImages = () => {
    const { images } = this.state;
    if (!images.length) return null;

    return (
      <View style={{ alignSelf: 'center' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 20 }}>
          {images.map(({ uri, height, width }) => (
            <View style={{ padding: 5 }} key={uri}>
              <Image source={{ uri }} style={{ width: 200, height: 200 }} />
            </View>
          ))}
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <Button secondary onPress={this._saveImages}>
            <Text>Salvar</Text>
          </Button>
        </View>
      </View>
    );

  }

  render() {
    const { uploading } = this.props;
    return (
      <Container>
        {uploading && <Loader visible={uploading} textContent={'Enviando Dados...'} />}
        <BaseHeader back title="Avatar Pré-cadastro" navigation={this.props.navigation} />
        <Content contentContainerStyle={{ flex: 1 }}>
          {this._renderImages()}
          <View style={[styles.bottomToolbar, { flexDirection: 'row', justifyContent: 'center', paddingBottom: 20 }]}>
            <Button style={{ marginRight: 20 }} onPress={this._takePhoto}>
              <Text>Camera</Text>
            </Button>
            <Button onPress={this._pickImage}>
              <Text>Biblioteca de Fotos</Text>
            </Button>
          </View>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  bottomToolbar: {
    width: winWidth,
    position: 'absolute',
    bottom: 0
  }
});

const mapStateToProps = state => {
  const { cliente, uploading } = state.clientes;
  return { cliente, uploading }
}

export default connect(mapStateToProps, {
  uploadAvatarRequest
})(ImagePickerScreen);
