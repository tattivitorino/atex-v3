import React from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator, Dimensions, Slider } from 'react-native';
import { Icon, Button, Text, Card, Thumbnail, H3 } from 'native-base';
import material from '../../../native-base-theme/variables/material';
const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get('window');

const AudioPlayer = ({
  isLoading,
  title,
  isPlaying,
  position,
  duration,
  onSliderValueChange,
  onTogglePlaying,
  onSlidingComplete
}) => {
  if (isLoading) {
    return (
      <View style={{ padding: 20 }}>
        <ActivityIndicator size={'large'} />
      </View>
    )
  }

  return (
    <Card style={[styles.container]}>

      {title && <View>
        <Text>Nome do audio</Text>
      </View>}

      <View style={[styles.mainContent]}>
        <View>
          <Button dark transparent onPress={() => {
            onTogglePlaying()
          }}>
            <Icon name={isPlaying ? 'pause' : 'play'} />
          </Button>
        </View>
        <View style={[styles.sliderContainer]}>
          <Slider
            disabled={isLoading}
            thumbTintColor={material.brandPrimary}
            minimumTrackTintColor={material.brandDark}
            value={position}
            onValueChange={onSliderValueChange}
            onSlidingComplete={onSlidingComplete} />
        </View>
      </View>

      <View>
        <Text>{duration}</Text>
      </View>

    </Card>
  )

}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    width: DEVICE_WIDTH - 40,
    paddingHorizontal: 10,
    paddingTop: 16,
    paddingBottom: 10,
    alignItems: 'center'
  },
  mainContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sliderContainer: {
    marginLeft: 10,
    width: DEVICE_WIDTH - 120
  },
  slider: {
    alignSelf: 'stretch'
  },
  duration: {},
  titleText: {}
});

export default AudioPlayer;