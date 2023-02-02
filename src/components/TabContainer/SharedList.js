import React, {useContext, useEffect, useState} from 'react';
import SwipeList from './SwipeList';
import firestore from '@react-native-firebase/firestore';
import {RefreshControl} from 'react-native';
import {AppContext} from '../../utils/context';
import {COLORS} from '../../utils/constants';
import {axiosFunctions} from '../../functions/items';
import {deleteUnexistingLists} from '../../functions/localStorage';

const SharedList = props => {
  const {state} = useContext(AppContext);
  const listIds = state.lists?.filter(item => item.shared).map(item => item.id);
  const [data, setData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  useEffect(() => {
    onRefresh();
  }, [state.sharedListsCount]);

  async function onRefresh() {
    if (listIds.length) {
      setRefreshing(true);
      const queries = [];
      const lists = [];
      const idsToDelete = [];
      listIds.forEach(id => {
        queries.push(firestore().collection('lists').doc(id).get());
      });
      const documents = await Promise.all(queries);
      documents.forEach(doc => {
        if (doc.exists) {
          lists.push(doc.data());
        } else {
          idsToDelete.push(doc.id);
        }
      });
      setData(lists);
      setRefreshing(false);
      /*firestore()
        .collection('lists')
        .where('id', 'in', listIds)
        .orderBy('createdAt', 'desc')
        .get()
        .then(query => {
          const lists = [];
          query.forEach(document => {
            if (document.exists) {
              lists.push({id: document.id, ...document.data()});
            } else {
              console.log('noting');
            }
          });
          setData(lists);
          setRefreshing(false);
        });*/
      if (idsToDelete.length) {
        deleteUnexistingLists(idsToDelete);
      }
    } else {
      setData([]);
    }
  }
  const refreshControl = (
    <RefreshControl
      progressBackgroundColor={COLORS.lightColor}
      colors={[COLORS.accentColor, COLORS.mainColor]}
      refreshing={refreshing}
      onRefresh={onRefresh}
    />
  );

  async function onDelete(item) {
    const listRef = state.lists.find(el => el.id === item.id);
    await axiosFunctions.delete('/lists', {
      data: {id: listRef.id, reqAdminKey: listRef.adminKey},
    });
    const newSharedLists = data.filter(list => list.id !== item.id);
    setData(newSharedLists);
  }

  return (
    <SwipeList
      data={data}
      navigation={props.navigation}
      refreshControl={refreshControl}
      deleteShared={onDelete}
    />
  );
};

export default SharedList;
