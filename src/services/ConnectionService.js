import { NetInfo } from 'react-native';

export const isConnected = () => {
  return NetInfo.isConnected;
}

export const getConnectionInfo = async () => {
  try {
    const { type, effectiveType } = await NetInfo.getConnectionInfo();
    return { type, effectiveType };
  } catch (e) {
    throw (e);
  }
}