import {View, TouchableOpacity, Alert, ActivityIndicator} from 'react-native';
import styles from './styles';
import React, {useContext} from 'react';
import EditSvg from '../../../assets/svg/edit.svg';
import Trash from '../../../assets/svg/trash.svg';
import List from '../../components/List';
import {StateContext, DispatchContext} from '../../utils/context';
import {SwipeListView} from 'react-native-swipe-list-view';
import {COLORS} from '../../utils/constants';

const SwipeList = props => {
  const appDispatch = useContext(DispatchContext);
  const appState = useContext(StateContext);
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
            const newArr = appState.lists.filter(
              itemFilter => itemFilter.id !== item.id,
            );
            await AsyncStorage.removeItem(`items-${item.id}`);
            await AsyncStorage.setItem('lists', JSON.stringify(newArr));
            if (item.date) {
              cancelNotification(item.notificationId);
            }
            appDispatch({type: 'setLists', data: newArr});
          } catch (e) {
            console.log(e);
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
        <TouchableOpacity
          onPress={() => editList(item)}
          style={[
            styles.hiddenIcon,
            {backgroundColor: COLORS.accentColor, borderRadius: 5},
          ]}>
          <EditSvg />
        </TouchableOpacity>
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
    return <Empty />;
  }
  return (
    <View style={styles.mainLists}>
      <SwipeListView
        showsVerticalScrollIndicator={false}
        data={props.data}
        alwaysBounceVertical={false}
        renderItem={renderItem}
        disableRightSwipe={true}
        rightOpenValue={-120}
        stopRightSwipe={-140}
        renderHiddenItem={hiddenItem}
        closeOnRowBeginSwipe={true}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

export default SwipeList;
