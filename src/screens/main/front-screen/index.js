import React, { Component } from 'react';
import { View, StyleSheet, Dimensions, Image, Slider, TouchableHighlight, Platform } from 'react-native';
import { Container, Content, Button, Text, Thumbnail, Icon } from 'native-base';
import BaseHeader from '../../../components/baseHeader';
import material from '../../../../native-base-theme/variables/material';
import AudioPlayer from '../../../components/audioPlayer';

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get('window');
const BACKGROUND_COLOR = '#f4f4f4';
const DISABLED_OPACITY = 0.5;
const FONT_SIZE = 14;
const LOADING_STRING = '... Carregando ...';
const BUFFERING_STRING = '... Buferizando ...';
const RATE_SCALE = 3.0;
const VIDEO_CONTAINER_HEIGHT = DEVICE_HEIGHT * 2.0 / 5.0 - FONT_SIZE * 2;

class FrontScreen extends Component {

  render() {
    return (
      <Container>
        <BaseHeader back title="Front Screen" navigation={this.props.navigation} />
        <Content contentContainerStyle={[styles.container]}>
          <View style={[styles.nameContainer, styles.border]}>
            <Text secondary>
              Carregando...
            </Text>
          </View>
          <View style={[styles.videoContainer, styles.border]}>
            <AudioPlayer />
          </View>
          <View style={[styles.buttonsContainerBase, styles.buttonsContainerTopRow, styles.border]}></View>
          <View style={[styles.buttonsContainerBase, styles.buttonsContainerMiddleRow, styles.border]}></View>
          <View style={[styles.buttonsContainerBase, styles.buttonsContainerBottomRow, styles.border]}></View>
        </Content>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  border: {
    borderWidth: 1, borderColor: '#000'
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'stretch'
  },
  nameContainer: {
    padding: 10
  },
  space: {
    height: 20,
  },
  videoContainer: {
    height: VIDEO_CONTAINER_HEIGHT
  },
  buttonsContainerBase: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonsContainerTopRow: {
    maxHeight: 60,
    minWidth: DEVICE_WIDTH / 2.0,
    maxWidth: DEVICE_WIDTH / 2.0,
  },
  buttonsContainerMiddleRow: {
    maxHeight: 60,
    alignSelf: 'stretch',
    paddingRight: 20,
  },
  buttonsContainerBottomRow: {
    maxHeight: 60,
    alignSelf: 'stretch',
    paddingRight: 20,
    paddingLeft: 20,
  },
});

export default FrontScreen;