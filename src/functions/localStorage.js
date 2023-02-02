import AsyncStorage from '@react-native-async-storage/async-storage';

export async function storeLocalList(newList) {
  let lists = await AsyncStorage.getItem('lists');
  if (!lists) {
    await AsyncStorage.setItem('lists', JSON.stringify([newList]));
  } else {
    lists = JSON.parse(lists);
    await AsyncStorage.setItem('lists', JSON.stringify([newList, ...lists]));
  }
}

export async function updateLocalList(newList) {
  const lists = await AsyncStorage.getItem('lists');
  const newArr = JSON.parse(lists).map(item => {
    if (item.id === route.params.id) {
      return {id: item.id, ...newList};
    }
    return item;
  });

  await AsyncStorage.setItem('lists', JSON.stringify(newArr));
}

export async function deleteUnexistingLists(listsToDelete) {
  const lists = await AsyncStorage.getItem('lists');
  if (lists.length) {
    const newList = JSON.parse(lists)
      .map(list => {
        const includes = listsToDelete.some(inc => inc === list.id);
        if (!includes) {
          return list;
        }
      })
      .filter(item => item);
    await AsyncStorage.setItem('lists', JSON.stringify(newList));
  }
}
