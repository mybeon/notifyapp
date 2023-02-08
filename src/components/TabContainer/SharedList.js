import React, {useContext, useEffect, useState} from 'react';
import SwipeList from './SwipeList';
import {RefreshControl} from 'react-native';
import {AppContext} from '../../utils/context';
import {COLORS} from '../../utils/constants';
import {axiosFunctions, deleteUnexistingLists} from '../../functions/storage';
import {getLists} from '../../functions/storage';

const SharedList = props => {
  const {state, dispatch} = useContext(AppContext);
  const [refreshing, setRefreshing] = useState(false);
  useEffect(() => {
    if (state.shared === null || !state.firstLoad) {
      dispatch({type: 'loaded'});
      onRefresh();
    }
  }, []);

  async function onRefresh() {
    setRefreshing(true);
    const localLists = await getLists('shared');
    if (localLists?.length) {
      const listsIds = localLists.map(item => item.id);
      const {
        data: {lists, idsToDelete},
      } = await axiosFunctions.get('/lists', {
        params: {lists: listsIds},
      });
      lists.forEach(list => {
        const ref = localLists.find(el => el.id === list.id);
        if (ref) {
          list.shareKey = ref.shareKey;
          list.adminKey = ref?.adminKey;
        }
      });
      dispatch({
        type: 'setLists',
        data: lists,
        listType: 'shared',
      });
      if (idsToDelete.length) {
        deleteUnexistingLists(idsToDelete);
      }
    } else {
      dispatch({type: 'setLists', data: [], listType: 'shared'});
    }
    setRefreshing(false);
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
    const listRef = state.shared.find(ref => ref.id === item.id);
    if (item.adminKey) {
      await axiosFunctions.delete('/lists', {
        data: {id: listRef.id, reqAdminKey: listRef.adminKey},
      });
    }
  }

  return (
    <SwipeList
      data={state.shared}
      navigation={props.navigation}
      refreshControl={refreshControl}
      deleteShared={onDelete}
    />
  );
};

export default SharedList;
