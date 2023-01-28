import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export const addItem = async (id, item, data, shared, shareKey) => {
  if (shared) {
    await axios.post(
      'http://10.0.2.2:5001/notify-grocery-list/us-central1/items',
      {reqId: id, reqShareKey: shareKey, reqData: [item, ...data]},
    );
  } else {
    await AsyncStorage.setItem(`items-${id}`, JSON.stringify([item, ...data]));
  }
};
export const updateItem = async (id, data, shared, shareKey) => {
  if (shared) {
    await axios.post(
      'http://10.0.2.2:5001/notify-grocery-list/us-central1/items',
      {reqId: id, reqShareKey: shareKey, reqData: data},
    );
  } else {
    await AsyncStorage.setItem(`items-${id}`, JSON.stringify(data));
  }
};
