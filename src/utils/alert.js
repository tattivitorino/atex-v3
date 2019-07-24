import { Alert } from 'react-native';

export const showAlert = (title, body, action) => {
  Alert.alert(title, body, [
    {
      text: 'OK',
      onPress: () => {
        if (action) action();
      }
    }
  ], { cancelable: false })
}

export const showConfirm = (title, body, cancelAction, okAction) => {
  Alert.alert(title, body, [
    {
      text: 'Cancelar',
      onPress: () => {
        if (cancelAction) cancelAction();
      }
    },
    {
      text: 'OK',
      onPress: () => {
        if (okAction) okAction();
      }
    }
  ], { cancelable: false })
}