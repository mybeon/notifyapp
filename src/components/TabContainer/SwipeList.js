import {View, TouchableOpacity, Alert, ActivityIndicator} from 'react-native';
import styles from './styles';
import React, {useContext} from 'react';
import EditSvg from '../../../assets/svg/edit.svg';
import Trash from '../../../assets/svg/trash.svg';
import List from '../../components/List';
import {AppContext} from '../../utils/context';
import {SwipeListView} from 'react-native-swipe-list-view';
import {COLORS} from '../../utils/constants';
import EmptyCart from '../../../assets/svg/EmptyCart';
import {deleteListStorage} from '../../functions/storage';

const SwipeList = props => {
  const {state, dispatch} = useContext(AppContext);
  const rightSwipe = props.refreshControl ? -60 : -120;
  const rightSwipeStop = props.refreshControl ? -80 : -140;
  const renderItem = ({item, index}) => {
    return (
      <List
        name={item.name}
        location={item.locationName}
        index={index}
        listLength={props.data.length}
        id={item.id}
        navigation={props.navigation}
        position={item.position}
        date={item.date}
        shared={item.shared}
      />
    );
  };
  function deleteList(item) {
    Alert.alert('Delete', 'Do you really want to delete this list ?', [
      {
        text: 'Cancel',
      },
      {
        text: 'YES',
        onPress: async () => {
          try {
            const type = item.shared ? 'shared' : 'local';
            const newArr = state[type].filter(
              itemFilter => itemFilter.id !== item.id,
            );
            await deleteListStorage(item, newArr, type, props.deleteShared);
            dispatch({type: 'setLists', data: newArr, listType: type});
          } catch (e) {
            console.log('delete error', e);
          }
        },
      },
    ]);
  }

  function editList(item) {
    props.navigation.navigate('Edit', {...item});
  }

  function hiddenItem({item}) {
    return (
      <View style={styles.hiddenItemContainer}>
        {!props.refreshControl && (
          <TouchableOpacity
            onPress={() => editList(item)}
            style={[
              styles.hiddenIcon,
              {backgroundColor: COLORS.accentColor, borderRadius: 5},
            ]}>
            <EditSvg />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={() => deleteList(item)}
          style={[styles.hiddenIcon, {backgroundColor: COLORS.danger}]}>
          <Trash />
        </TouchableOpacity>
      </View>
    );
  }

  if (!props.data) {
    return (
      <ActivityIndicator color={'white'} style={styles.loader} size={50} />
    );
  }

  if (props.data && !props.data.length) {
    return (
      <View style={{marginTop: 100}}>
        <EmptyCart />
      </View>
    );
  }
  return (
    <View style={styles.mainLists}>
      <SwipeListView
        refreshControl={props.refreshControl}
        showsVerticalScrollIndicator={false}
        data={props.data}
        alwaysBounceVertical={false}
        renderItem={renderItem}
        disableRightSwipe={true}
        rightOpenValue={rightSwipe}
        stopRightSwipe={rightSwipeStop}
        renderHiddenItem={hiddenItem}
        closeOnRowBeginSwipe={true}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

export default SwipeList;
