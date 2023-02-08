import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import {scheduleNotification, cancelNotification} from './notification';
import axios from 'axios';
import {URLS} from '../utils/constants';

let url = URLS.prod;

if (__DEV__) {
  url = URLS.dev;
}

export const axiosFunctions = axios.create({baseURL: url});

export async function storeList(
  newList,
  type = 'local',
  notificationDate,
  fromQR = true,
) {
  if (type == 'shared' && fromQR) {
    newList.date = null;
    newList.adminKey = uuid.v4();
    newList.shareKey = uuid.v4();
    newList.createdAt = new Date().toString();
    await axiosFunctions.post('/lists', newList);
  }
  let lists = await AsyncStorage.getItem(type);
  if (!lists) {
    await AsyncStorage.setItem(type, JSON.stringify([newList]));
  } else {
    lists = JSON.parse(lists);
    await AsyncStorage.setItem(type, JSON.stringify([newList, ...lists]));
  }
  if (newList.date) {
    scheduleNotification(
      notificationDate,
      newList.notificationId,
      newList.name,
    );
  }
}

export async function updateLocalList(newList, notificationDate, itemId) {
  const lists = await AsyncStorage.getItem('local');
  const newArr = JSON.parse(lists).map(item => {
    if (item.id === itemId) {
      if (newList.date && new Date(newList.date) > Date.now()) {
        cancelNotification(item.notificationId);
        scheduleNotification(
          notificationDate,
          newList.notificationId,
          newList.name,
        );
      }
      return {id: item.id, ...newList};
    }
    return item;
  });
  await AsyncStorage.setItem('lists', JSON.stringify(newArr));
  return newArr;
}

export async function deleteUnexistingLists(listsToDelete) {
  const lists = await AsyncStorage.getItem('shared');
  if (lists.length) {
    const newList = JSON.parse(lists)
      .map(list => {
        const includes = listsToDelete.some(inc => inc === list.id);
        if (!includes) {
          return list;
        }
      })
      .filter(item => item);
    await AsyncStorage.setItem('shared', JSON.stringify(newList));
  }
}

export async function getLists(type = 'local') {
  return AsyncStorage.getItem(type).then(data => {
    if (data) {
      return JSON.parse(data);
    }
    return [];
  });
}

export async function deleteListStorage(item, newArr, type, deleteShared) {
  await Promise.all([
    AsyncStorage.removeItem(`items-${item.id}`),
    AsyncStorage.setItem(type, JSON.stringify(newArr)),
    item.shared ? deleteShared(item) : null,
  ]);
  if (item.date) {
    cancelNotification(item.notificationId);
  }
}

export async function getListsCount(type) {
  const result = await AsyncStorage.getItem(type);
  let count = 0;
  if (result) {
    count = JSON.parse(result).length;
  }
  return count;
}

export const addItem = async (id, item, data, shared, shareKey) => {
  if (shared) {
    await axiosFunctions.put('/lists', {
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
    await axiosFunctions.put('/lists', {
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
    const result = await axiosFunctions.get('/lists', {
      params: {id, shareKey, type: 'single'},
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
