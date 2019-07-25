/** 
 * Serviço de persistencia de credenciais
 * https://docs.expo.io/versions/v32.0.0/sdk/securestore/
 * IOS: usa o KeyChain do aparelho
 * Android: usa o Shared Preferences
 * APENAS AS CREDENCIAIS DE TOKEN: PUSH, AUTH E REFRESH SERAO ARMAZENADAS NO Secure Store
 */

import * as SecureStore from 'expo-secure-store';

export const getStorageItem = (key) => {
  SecureStore.getItemAsync(key)
    .then(res => {
      if (res) return Promise.resolve(res);
      return Promise.reject(false);
    })
    .catch(err => {
      return Promise.reject(err)
    })
}

export const getStorageItemAsync = async (key) => {
  try {
    const response = await SecureStore.getItemAsync(key);
    return response;
  } catch (e) {
    throw (e)
  }
}

export const setStorageItem = (key, value) => {
  SecureStore.setItemAsync(key, value)
    .then(res => {
      return Promise.resolve(true);
    })
    .catch(err => {
      return Promise.reject(err)
    })
}

export const setStorageItemAsync = async (key, value) => {
  try {
    const response = await SecureStore.setItemAsync(key, value);
    return response;
  } catch (e) {
    throw (e);
  }
}

export const deleteStorageItem = (key) => {
  SecureStore.deleteItemAsync(key)
    .then(res => {
      return Promise.resolve(true);
    })
    .catch(err => {
      return Promise.reject(err)
    })
}

export const deleteStorageItemAsync = async (key) => {
  try {
    const response = await SecureStore.deleteItemAsync(key);
    return response;
  } catch (e) {
    throw (e)
  }
}


