import React, { Component } from 'react';
import { View, StyleSheet, Dimensions, Image, Slider, TouchableHighlight, Platform, ActivityIndicator } from 'react-native';
import { Container, Content, Button, Text, Thumbnail, Icon, Card } from 'native-base';

import BaseHeader from '../../../components/baseHeader';
import AudioPlayer from '../../../components/audioPlayer';

import { Audio, Video } from 'expo-av';

import material from '../../../../native-base-theme/variables/material';

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get('window');
const BACKGROUND_COLOR = '#f4f4f4';
const DISABLED_OPACITY = 0.5;
const FONT_SIZE = 14;
const LOADING_STRING = '... carregando ...';
const BUFFERING_STRING = '... carregando ...';
const RATE_SCALE = 3.0;
const VIDEO_CONTAINER_HEIGHT = DEVICE_HEIGHT * 2.0 / 5.0 - FONT_SIZE * 2;;

class MediaPlayerScreen extends Component {
  constructor(props) {
    super(props);

    const item = this.props.navigation.getParam('item');
    const meta_dados = JSON.parse(item.meta_dados);
    const isVideo = meta_dados.mimeType.indexOf('video') !== -1 ? true : false;

    this.state = {
      item: item,
      meta_dados: meta_dados,
      isVideo: isVideo,
      isPlaying: false,
      isLoading: true,
      isBuffering: false,
      playbackInstancePosition: 0,
      playbackInstanceDuration: 0,
      shouldPlay: false,
      videoWidth: DEVICE_WIDTH,
      videoHeight: VIDEO_CONTAINER_HEIGHT,

    }
    this.isSeeking = false;
    this.shouldPlayAtEndOfSeek = false;
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

    this._loadNewPlaybackInstance(false);
  }

  async componentWillUnmount() {
    try {
      if (this.playbackInstance != null) {
        await this.playbackInstance.unloadAsync();
        this.playbackInstance.setOnPlaybackStatusUpdate(null);
        this.playbackInstance = null;
      }
    } catch (error) {

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
        this.playbackInstance.setOnPlaybackStatusUpdate(null);
        this.playbackInstance = null;
      }

      const source = { uri: this.state.item.arquivo };
      const initialStatus = {
        shouldPlay: playing,
        rate: 1.0,
        shouldCorrectPitch: true,
        volume: 1.0,
        isMuted: false,
        isLooping: false,
        // // UNCOMMENT THIS TO TEST THE OLD androidImplementation:
        // androidImplementation: 'MediaPlayer',
      };

      if (this.state.isVideo) {


      } else {
        const { sound } = await Audio.Sound.createAsync(
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
        isPlaying: false,
        isLoading: true,
        playbackInstanceDuration: null,
        playbackInstancePosition: null,
      });
    } else {
      this.setState({
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
        isPlaying: status.isPlaying,
        shouldPlay: status.shouldPlay,
        isBuffering: status.isBuffering,
      });
      if (status.didJustFinish && !status.isLooping) {
        console.log('JUST FINISHED');
        this._restartPlayback();
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
    this.setState({
      isLoading: true,
      shouldPlay: false
    })
  };

  _onLoad = status => {
    console.log(`ON LOAD : ${JSON.stringify(status)}`);
    this.setState({
      isLoading: false,
      shouldPlay: true
    })
  };

  _onError = error => {
    console.log(`ON ERROR : ${error}`);
  };

  //video handler
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

  _restartPlayback() {
    if (this.playbackInstance != null) {
      this.playbackInstance.setPositionAsync(0);
    }
  }

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

  _getSliderPosition() {
    if (
      this.playbackInstance != null &&
      this.state.playbackInstancePosition != null &&
      this.state.playbackInstanceDuration != null
    ) {
      return this.state.playbackInstancePosition / this.state.playbackInstanceDuration;
    }
    return 0;
  }

  _onSliderValueChange = value => {
    //console.log('SLIDER VALUE CHANGE: ', value);
    if (this.playbackInstance != null && !this.isSeeking) {
      this.isSeeking = true;
      this.shouldPlayAtEndOfSeek = this.state.shouldPlay;
      this.playbackInstance.pauseAsync();
    }
  };

  _onSlidingComplete = async value => {
    //console.log('SLIDING COMPLETE: ', value);
    if (this.playbackInstance != null) {
      this.isSeeking = false;
      const seekPosition = value * this.state.playbackInstanceDuration;
      if (this.shouldPlayAtEndOfSeek) {
        this.playbackInstance.playFromPositionAsync(seekPosition);
      } else {
        this.playbackInstance.setPositionAsync(seekPosition);
      }
    }
  };

  _getMMSSFromMillis(millis) {
    const totalSeconds = millis / 1000;
    const seconds = Math.floor(totalSeconds % 60);
    const minutes = Math.floor(totalSeconds / 60);

    const padWithZero = number => {
      const string = number.toString();
      if (number < 10) {
        return '0' + string;
      }
      return string;
    };
    return padWithZero(minutes) + ':' + padWithZero(seconds);
  }

  _getTimestamp() {
    if (
      this.playbackInstance != null &&
      this.state.playbackInstancePosition != null &&
      this.state.playbackInstanceDuration != null
    ) {
      return `${this._getMMSSFromMillis(
        this.state.playbackInstancePosition
      )} / ${this._getMMSSFromMillis(this.state.playbackInstanceDuration)}`;
    }
    return '';
  }



  render() {
    const { item, isVideo, isLoading, isPlaying, shouldPlay } = this.state;

    return (<Container>
      <BaseHeader back title="Media Player" navigation={this.props.navigation} />
      <Content contentContainerStyle={styles.container}>

        <View style={styles.nameContainer}>
          {!isLoading && <View>
            <Text>{item.tipo_documento_nome}</Text>
            {item.referencia ? <Text>{item.referencia}</Text> : null}
            {item.comentario ? <Text>{item.comentario}</Text> : null}
          </View>}
        </View>

        {!isVideo ? <AudioPlayer
          isLoading={isLoading}
          isPlaying={isPlaying}
          position={this._getSliderPosition()}
          duration={this._getTimestamp()}
          onTogglePlaying={this._onPlayPausePressed}
          onSliderValueChange={this._onSliderValueChange}
          onSlidingComplete={this._onSlidingComplete}
        />
          : null}

        {isVideo && isLoading ? (<View style={{ padding: 20 }}>
          <ActivityIndicator size={'large'} />
        </View>) : null}

        <Video
          source={{ uri: item.arquivo }}
          style={[styles.video, {
            opacity: this.state.isVideo ? 1.0 : 0.0,
            width: this.state.videoWidth,
            height: this.state.videoHeight,
          }]}
          shouldPlay={shouldPlay}
          resizeMode={Video.RESIZE_MODE_CONTAIN}
          onPlaybackStatusUpdate={this._onPlaybackStatusUpdate}
          onLoadStart={this._onLoadStart}
          onLoad={this._onLoad}
          onError={this._onError}
          onFullscreenUpdate={this._onFullscreenUpdate}
          onReadyForDisplay={this._onReadyForDisplay}
          useNativeControls={true}
        />

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

export default MediaPlayerScreen;