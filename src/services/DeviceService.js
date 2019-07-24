import Constants from 'expo-constants';
import { Platform } from 'react-native';

const device = {
  installationId: Constants.installationId,
  deviceName: Constants.deviceName,
  platformOS: Platform.OS,
  platform: {
    ios: null,
    android: null
  }
}

if (Platform.OS === 'ios') {
  device.platform.ios = {
    platform: Constants.platform.ios.platform,
    model: Constants.platform.ios.model,
    systemVersion: Constants.platform.ios.systemVersion
  }
}
else {
  device.platform.android = {
    versionCode: Constants.platform.android.versionCode
  }
}

const simpleDevice = {
  uuid: Constants.installationId,
  platform: Platform.OS,
  model: Platform.OS === 'ios' ? Constants.platform.ios.model : Constants.deviceName,
  version: Platform.OS === 'ios' ? Constants.platform.ios.systemVersion : Constants.systemVersion
}

export { device, simpleDevice };