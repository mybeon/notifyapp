import AsyncStorage from '@react-native-async-storage/async-storage';
import {axiosFunctions} from '../..';

export const addItem = async (id, item, data, shared, shareKey) => {
  if (shared) {
    await axiosFunctions.post('/items', {
      reqId: id,
      reqShareKey: shareKey,
      reqData: [item, ...data],
    });
  } else {
    await AsyncStorage.setItem(`items-${id}`, JSON.stringify([item, ...data]));
  }
};
export const updateItem = async (id, data, shared, shareKey) => {
  if (shared) {
    await axiosFunctions.post('/items', {
      reqId: id,
      reqShareKey: shareKey,
      reqData: data,
    });
  } else {
    await AsyncStorage.setItem(`items-${id}`, JSON.stringify(data));
  }
};
