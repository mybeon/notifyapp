import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {URLS} from '../utils/constants';

let url = URLS.prod;

if (__DEV__) {
  url = URLS.dev;
}

export const axiosFunctions = axios.create({baseURL: url});

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

export const getItems = async (id, shareKey) => {
  if (shareKey) {
    const result = await axiosFunctions.get('/items', {
      params: {id, shareKey},
    });
    return result;
  } else {
    const items = await AsyncStorage.getItem(`items-${id}`);
    if (items) {
      return JSON.parse(items);
    } else {
      return [];
    }
  }
};
