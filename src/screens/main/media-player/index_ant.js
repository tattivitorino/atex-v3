import React, { Component } from 'react';
import { View, StyleSheet, Dimensions, Image, Slider, TouchableHighlight, Platform, ActivityIndicator } from 'react-native';
import { Container, Content, Button, Text, Thumbnail, Icon } from 'native-base';
import BaseHeader from '../../../components/baseHeader';

import { Audio, Video } from 'expo';

import material from '../../../../native-base-theme/variables/material';

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get('window');
const BACKGROUND_COLOR = '#f4f4f4';
const DISABLED_OPACITY = 0.5;
const FONT_SIZE = 14;
const LOADING_STRING = '... carregando ...';
const BUFFERING_STRING = '... carregando ...';
const RATE_SCALE = 3.0;
const VIDEO_CONTAINER_HEIGHT = DEVICE_HEIGHT * 2.0 / 5.0 - FONT_SIZE * 2;;

class MediaPlayerScreenAnt extends Component {
  constructor(props) {
    super(props);

    const item = this.props.navigation.getParam('item');
    console.log(item);

    const meta_dados = JSON.parse(item.meta_dados);
    const isVideo = meta_dados.mimeType.indexOf('video') !== -1 ? true : false;

    this.state = {
      item: item,
      meta_dados: meta_dados,
      isVideo: isVideo,
      showVideo: false,
      playbackInstanceName: LOADING_STRING,
      muted: false,
      playbackInstancePosition: null,
      playbackInstanceDuration: null,
      shouldPlay: false,
      isPlaying: false,
      isBuffering: false,
      isLoading: true,
      shouldCorrectPitch: true,
      volume: 1.0,
      rate: 1.0,
      videoWidth: DEVICE_WIDTH,
      videoHeight: VIDEO_CONTAINER_HEIGHT,
      poster: false,
      useNativeControls: true,
      fullscreen: false,
      throughEarpiece: false,
    }

    this.video = null;
    this.playbackInstance = null;
  }

  componentDidMount() {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid: false,
    });
  }

  async componentWillUnmount() {
    if (this.playbackInstance != null) {
      await this.playbackInstance.unloadAsync();
      this.playbackInstance.setOnPlaybackStatusUpdate(null);
      this.playbackInstance = null;
    }
  }

  _mountVideo = component => {
    this.video = component;
    this._loadNewPlaybackInstance(false);
  };

  async _loadNewPlaybackInstance(playing) {
    try {
      if (this.playbackInstance != null) {
        await this.playbackInstance.unloadAsync();
        //this.playbackInstance.setOnPlaybackStatusUpdate(null);
        this.playbackInstance = null;
        this.video = null;
      }

      const source = { uri: this.state.item.arquivo };
      const initialStatus = {
        shouldPlay: playing,
        rate: this.state.rate,
        shouldCorrectPitch: this.state.shouldCorrectPitch,
        volume: this.state.volume,
        isMuted: this.state.muted,
        isLooping: false,
        // // UNCOMMENT THIS TO TEST THE OLD androidImplementation:
        // androidImplementation: 'MediaPlayer',
      };


      if (this.state.meta_dados.mimeType.indexOf('video') !== -1) {
        //console.log(this.video)       

        await this.video.loadAsync(source, initialStatus);

        this.playbackInstance = this.video;
        //this.video.setOnPlaybackStatusUpdate(this._onPlaybackStatusUpdate);
        const status = await this.video.getStatusAsync();

      } else {
        const { sound, status } = await Audio.Sound.createAsync(
          source,
          initialStatus,
          this._onPlaybackStatusUpdate
        );
        this.playbackInstance = sound;
      }

      this._updateScreenForLoading(false);

    } catch (error) {
      console.log(error)
    }
  }

  _updateScreenForLoading(isLoading) {
    if (isLoading) {
      this.setState({
        showVideo: false,
        isPlaying: false,
        playbackInstanceName: LOADING_STRING,
        playbackInstanceDuration: null,
        playbackInstancePosition: null,
        isLoading: true,
      });
    } else {
      this.setState({
        playbackInstanceName: this.state.isVideo ? 'Video' : 'Audio',
        showVideo: this.state.isVideo,
        isLoading: false,
      });
    }
  }

  _onPlaybackStatusUpdate = status => {
    //console.log(status);

    if (status.isLoaded) {
      this.setState({
        playbackInstancePosition: status.positionMillis,
        playbackInstanceDuration: status.durationMillis,
        shouldPlay: status.shouldPlay,
        isPlaying: status.isPlaying,
        isBuffering: status.isBuffering,
        rate: status.rate,
        muted: status.isMuted,
        volume: status.volume,
        shouldCorrectPitch: status.shouldCorrectPitch,
      });
      if (status.didJustFinish && !status.isLooping) {
        //this._advanceIndex(true);
        //this._updatePlaybackInstanceForIndex(true);
      }
    } else {
      if (status.error) {
        console.log(`ERRO NO PLAYER: ${status.error}`);
      }
    }
  }

  _onLoadStart = () => {
    console.log(`ON LOAD START`);
  };

  _onLoad = status => {
    console.log(`ON LOAD : ${JSON.stringify(status)}`);
  };

  _onError = error => {
    console.log(`ON ERROR : ${error}`);
  };

  _onReadyForDisplay = event => {
    const widestHeight = DEVICE_WIDTH * event.naturalSize.height / event.naturalSize.width;
    if (widestHeight > VIDEO_CONTAINER_HEIGHT) {
      this.setState({
        videoWidth: VIDEO_CONTAINER_HEIGHT * event.naturalSize.width / event.naturalSize.height,
        videoHeight: VIDEO_CONTAINER_HEIGHT,
      });
    } else {
      this.setState({
        videoWidth: DEVICE_WIDTH,
        videoHeight: DEVICE_WIDTH * event.naturalSize.height / event.naturalSize.width,
      });
    }
  };

  _onFullscreenUpdate = event => {
    console.log(`FULLSCREEN UPDATE : ${JSON.stringify(event.fullscreenUpdate)}`);
  };

  _onPlayPausePressed = () => {
    if (this.playbackInstance != null) {
      if (this.state.isPlaying) {
        this.playbackInstance.pauseAsync();
      } else {
        this.playbackInstance.playAsync();
      }
    }
  };

  _onStopPressed = () => {
    if (this.playbackInstance != null) {
      this.playbackInstance.stopAsync();
    }
  };



  render() {
    return (<Container>
      <BaseHeader back title="Media Player" navigation={this.props.navigation} />
      <Content contentContainerStyle={styles.container}>

        <View style={styles.nameContainer}>
          {this.state.isLoading ? <ActivityIndicator size={'large'} /> : <View>
            <Text>{this.state.playbackInstanceName}</Text>
            {this.state.item.referencia ? <Text>{this.state.item.referencia}</Text> : null}
            {this.state.item.comentario ? <Text>{this.state.item.comentario}</Text> : null}
          </View>}
        </View>

        {!this.state.isVideo ? <View
          style={[
            styles.buttonsContainerBase,
            styles.buttonsContainerTopRow,
            {
              opacity: this.state.isLoading ? DISABLED_OPACITY : 1.0,
              marginVertical: 10
            },
          ]}>

          <Button disabled={this.state.isLoading} secondary onPress={this._onPlayPausePressed}>
            {this.state.isPlaying ? <Icon name="pause" /> : <Icon name="play" />}
          </Button>

        </View> : null}

        <View style={[styles.videoContainer]}>
          <Video
            ref={this._mountVideo}
            style={[
              styles.video,
              {
                opacity: this.state.showVideo ? 1.0 : 0.0,
                width: this.state.videoWidth,
                height: this.state.videoHeight,
              },
            ]}
            resizeMode={Video.RESIZE_MODE_CONTAIN}
            onPlaybackStatusUpdate={this._onPlaybackStatusUpdate}
            onLoadStart={this._onLoadStart}
            onLoad={this._onLoad}
            onError={this._onError}
            onFullscreenUpdate={this._onFullscreenUpdate}
            onReadyForDisplay={this._onReadyForDisplay}
            useNativeControls={this.state.useNativeControls}
          />
        </View>



      </Content>
    </Container>);
  }
}

const styles = StyleSheet.create({
  border: { borderWidth: 1, borderColor: '#000' },
  emptyContainer: {
    alignSelf: 'stretch',
    backgroundColor: BACKGROUND_COLOR,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignSelf: 'stretch'
  },
  wrapper: {},
  nameContainer: {
    padding: 10
  },
  space: {
    height: FONT_SIZE + 5,
  },
  videoContainer: {
    marginVertical: 10,
    height: VIDEO_CONTAINER_HEIGHT,
  },
  video: {
    maxWidth: DEVICE_WIDTH,
  },
  playbackContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'stretch',
    minHeight: 19 * 2.0,
    maxHeight: 19 * 2.0,
  },
  playbackSlider: {
    alignSelf: 'stretch',
  },
  timestampRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    minHeight: FONT_SIZE,
  },
  text: {
    fontSize: FONT_SIZE,
    minHeight: FONT_SIZE + 5,
  },
  buffering: {
    textAlign: 'left',
    paddingLeft: 20,
  },
  timestamp: {
    textAlign: 'right',
    paddingRight: 20,
  },
  button: {
    backgroundColor: BACKGROUND_COLOR,
  },
  buttonsContainerBase: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
  volumeContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minWidth: DEVICE_WIDTH / 2.0,
    maxWidth: DEVICE_WIDTH / 2.0,
  },
  volumeSlider: {
    width: DEVICE_WIDTH / 2.0,
  },
  buttonsContainerBottomRow: {
    maxHeight: 60,
    alignSelf: 'stretch',
    paddingRight: 20,
    paddingLeft: 20,
  },
  rateSlider: {
    width: DEVICE_WIDTH / 2.0,
  },
  buttonsContainerTextRow: {
    maxHeight: FONT_SIZE + 5,
    alignItems: 'center',
    paddingRight: 20,
    paddingLeft: 20,
    minWidth: DEVICE_WIDTH,
    maxWidth: DEVICE_WIDTH,
  }
});

export default MediaPlayerScreenAnt;