import React, {useContext, useEffect} from 'react';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {FONTS, COLORS} from '../utils/constants';
import TopIcon from '../../assets/svg/mainIcon.svg';
import AddListSvg from '../../assets/svg/addList.svg';
import EditSvg from '../../assets/svg/edit.svg';
import Trash from '../../assets/svg/trash.svg';
import List from '../components/List';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Empty from '../components/Empty';
import {SwipeListView} from 'react-native-swipe-list-view';
import {managePermission} from '../functions/requestPermission';
import {DispatchContext, StateContext} from '../utils/context';
import {cancelNotification} from '../functions/notification';

const {height} = Dimensions.get('window');

const Home = ({navigation}) => {
  const appDispatch = useContext(DispatchContext);
  const appState = useContext(StateContext);

  useEffect(() => {
    managePermission()
      .then(res => {
        if (res.status !== 'granted') return;
        appDispatch({
          type: 'currentPosition',
          value: [res.latitude, res.longitude],
        });
      })
      .catch(e => {
        console.log(e);
      });
  }, []);

  useEffect(() => {
    AsyncStorage.getItem('lists')
      .then(res => {
        if (res) {
          const data = JSON.parse(res);
          if (data.length) {
            appDispatch({type: 'setLists', data});
          } else {
            appDispatch({type: 'setLists', data: []});
          }
        } else {
          appDispatch({type: 'setLists', data: []});
        }
      })
      .catch(e => console.log(e));
  }, []);

  const renderItem = ({item, index}) => {
    return (
      <List
        name={item.name}
        location={item.locationName}
        index={index}
        id={item.id}
        navigation={navigation}
        position={item.position}
        date={item.date}
      />
    );
  };

  const headerComponent = () => {
    return <View style={{height: 20}}></View>;
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
    navigation.navigate('Edit', {...item});
  }

  function hiddenItem({item}) {
    return (
      <View style={style.hiddenItemContainer}>
        <TouchableOpacity
          onPress={() => editList(item)}
          style={[
            style.hiddenIcon,
            {backgroundColor: COLORS.accentColor, borderRadius: 5},
          ]}>
          <EditSvg />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => deleteList(item)}
          style={[style.hiddenIcon, {backgroundColor: COLORS.danger}]}>
          <Trash />
        </TouchableOpacity>
      </View>
    );
  }

  function MainContent() {
    if (!appState.lists) {
      return (
        <ActivityIndicator color={'white'} style={style.loader} size={50} />
      );
    }
    if (appState.lists && !appState.lists.length) {
      return <Empty />;
    }
    return (
      <View style={style.mainLists}>
        <SwipeListView
          style={{borderRadius: 5, overflow: 'hidden'}}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={headerComponent}
          data={appState.lists}
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
  }

  return (
    <>
      <View style={style.container}>
        <View style={style.upperSection}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TopIcon />
            <Text style={style.upperText}>Lists</Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('AddList');
          }}
          activeOpacity={0.7}
          style={style.addListContainer}>
          <AddListSvg />
        </TouchableOpacity>
        <MainContent />
      </View>
    </>
  );
};

const style = StyleSheet.create({
  container: {
    backgroundColor: COLORS.mainColor,
    height,
    paddingHorizontal: 18,
    paddingVertical: 22,
  },
  upperSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  upperText: {
    fontFamily: FONTS.medium,
    fontSize: 32,
    letterSpacing: 5,
    marginLeft: 4,
    color: 'white',
  },
  addListContainer: {
    height: 70,
    width: 70,
    borderRadius: 70,
    backgroundColor: COLORS.mainColor,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 50,
    right: 18,
    zIndex: 10,
    elevation: 10,
  },
  mainLists: {
    height: height * 0.8,
    borderRadius: 5,
    overflow: 'hidden',
    marginTop: 6,
  },
  loader: {
    position: 'absolute',
    top: '40%',
    left: '50%',
  },
  hiddenItemContainer: {
    height: '100%',
    width: 140,
    position: 'absolute',
    right: 0,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    backgroundColor: COLORS.accentColor,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    overflow: 'hidden',
  },
  hiddenIcon: {
    width: 60,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Home;
