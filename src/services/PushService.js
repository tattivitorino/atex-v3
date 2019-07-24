import { getStorageItemAsync, setStorageItemAsync } from './PersistService';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import { PUSH_TOKEN_KEY } from '../config';

export const registerForPushNotifications = async () => {

  try {
    let previousToken = await getStorageItemAsync(PUSH_TOKEN_KEY);
    console.log('PREVIOUS TOKEN: ', previousToken)
    if (previousToken) return previousToken;

    const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    let finalStatus = existingStatus;
    console.log('FINAL STATUS B4: ', finalStatus);

    if (existingStatus !== 'granted') {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
    console.log('FINAL STATUS AFTER: ', finalStatus);

    if (finalStatus !== 'granted') throw new Error('Permissão Não Concedida!!!!');

    let pushToken = await Notifications.getExpoPushTokenAsync();
    console.log('PUSH TOKEN: ', pushToken);

    const saved = await setStorageItemAsync(PUSH_TOKEN_KEY, pushToken);
    return pushToken;
    //throw new Error('Testing Error')

  } catch (e) {
    console.log(e);
    throw (e.message);
  }
}