import React, {useContext, useEffect, useState} from 'react';
import SwipeList from './SwipeList';
import firestore from '@react-native-firebase/firestore';
import {RefreshControl} from 'react-native';
import {AppContext} from '../../utils/context';
import {COLORS} from '../../utils/constants';
import axios from 'axios';

const SharedList = props => {
  const {state, dispatch} = useContext(AppContext);
  const listIds = state.lists?.filter(item => item.shared).map(item => item.id);
  const [refreshing, setRefreshing] = useState(false);
  useEffect(() => {
    if (state.sharedLists === null) {
      onRefresh();
    }
  }, []);

  function onRefresh() {
    if (listIds.length) {
      setRefreshing(true);
      firestore()
        .collection('lists')
        .where('id', 'in', listIds)
        .orderBy('createdAt', 'desc')
        .get()
        .then(query => {
          const lists = [];
          query.forEach(document => {
            lists.push({id: document.id, ...document.data()});
          });
          dispatch({type: 'setSharedLists', data: lists});
          setRefreshing(false);
        });
    } else {
      dispatch({type: 'setSharedLists', data: []});
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
    await axios.delete(
      'http://10.0.2.2:5001/notify-grocery-list/us-central1/lists',
      {data: {id: listRef.id, reqAdminKey: listRef.adminKey}},
    );
    const newSharedList = state.sharedLists.filter(list => list.id !== item.id);
    dispatch({type: 'setSharedLists', data: newSharedList});
  }

  return (
    <SwipeList
      data={state.sharedLists}
      navigation={props.navigation}
      refreshControl={refreshControl}
      deleteShared={onDelete}
    />
  );
};

export default SharedList;
