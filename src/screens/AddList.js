import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from 'react-native';
import {COLORS, FONTS, TYPO} from '../utils/constants';
import CloseSvg from '../../assets/svg/close.svg';
import Calendar from '../../assets/svg/calendar-1.svg';
import Field from '../components/Field';
import {StateContext, DispatchContext} from '../utils/context';
import axios from 'axios';
import SearchItem from '../components/SearchItem';
import Loader from '../components/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import DatePicker from 'react-native-date-picker';
import getDate from '../functions/getDate';
import {scheduleNotification} from '../functions/notification';
import {useNetInfo} from '@react-native-community/netinfo';
import config from 'react-native-config';

const {width, height} = Dimensions.get('window');

const AddList = ({navigation}) => {
  const netinfo = useNetInfo();
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const opacity =
    netinfo.isConnected && appState.currentPosition.length ? 1 : 0.3;
  const [searchData, setSearchData] = useState([]);
  const [searchOverlay, setSearchOverlay] = useState(false);
  const [loading, setLoading] = useState(false);
  const [createDisable, setCreateDisable] = useState(false);
  const [openDate, setOpenDate] = useState(false);
  const closeModal = () => {
    navigation.goBack();
    appDispatch({type: 'clearList'});
  };
  const createList = async () => {
    if (appState.addListData.name.trim() !== '') {
      setCreateDisable(true);
      const id = uuid.v4();
      const newlist = {
        id,
        name: appState.addListData.name,
        locationName: appState.addListData.location,
        position: appState.addListData.position,
        date: appState.addListData.date
          ? new Date(appState.addListData.date).toString()
          : null,
        notificationId: appState.addListData.date
          ? Math.floor(Math.random() * Math.pow(2, 32)).toString()
          : null,
      };
      try {
        let lists = await AsyncStorage.getItem('lists');
        if (!lists) {
          await AsyncStorage.setItem('lists', JSON.stringify([newlist]));
        } else {
          lists = JSON.parse(lists);
          await AsyncStorage.setItem(
            'lists',
            JSON.stringify([newlist, ...lists]),
          );
        }
        appDispatch({type: 'updateLists', data: newlist});
        if (newlist.date) {
          scheduleNotification(
            appState.addListData.date,
            newlist.notificationId,
            newlist.name,
          );
        }
      } catch (e) {
        console.log('create list error', e);
      }
      navigation.navigate('List', {
        id: newlist.id,
        name: newlist.name,
        position: newlist.position,
      });
      appDispatch({type: 'clearList'});
    }
  };

  useEffect(() => {
    if (
      appState.addListData.location.trim() === '' ||
      appState.addListData.fromSearch
    ) {
      setSearchOverlay(false);
      setLoading(false);
      setSearchData([]);
      return;
    }
    setSearchOverlay(true);
    setLoading(true);
    const request = axios.CancelToken.source();
    const sendRequest = setTimeout(() => {
      axios
        .get(
          `https://places.ls.hereapi.com/places/v1/autosuggest?at=31.652366,-8.078394&q=${appState.addListData.location}&apiKey=${config.GEO_API}`,
          {cancelToken: request.token},
        )
        .then(res => {
          setSearchData(res.data.results);
          setLoading(false);
        })
        .catch(err => console.log(err));
    }, 1200);

    return () => {
      request.cancel();
      clearTimeout(sendRequest);
    };
  }, [appState.addListData.location]);

  function searchItemPressed(item) {
    appDispatch({type: 'locationChange', value: item.title, search: true});
    appDispatch({type: 'setListPosition', value: item.position});
    setSearchOverlay(false);
    setLoading(false);
    setSearchData([]);
  }

  return (
    <ScrollView style={style.container}>
      <TouchableOpacity
        style={style.closeIcon}
        activeOpacity={0.75}
        onPress={closeModal}>
        <CloseSvg />
      </TouchableOpacity>

      <View style={style.formContainer}>
        <Field
          label="Name"
          placeholder="List Name"
          value={appState.addListData.name}
          dispatch={'nameChange'}
        />
        <View style={{opacity}}>
          <Field
            label="Location"
            placeholder="Choose location"
            margin={true}
            value={appState.addListData.location}
            dispatch={'locationChange'}
            edit={
              netinfo.isConnected && appState.currentPosition.length
                ? true
                : false
            }
          />
          <Pressable
            style={style.emptySearch}
            onPress={() => appDispatch({type: 'locationChange', value: ''})}>
            <CloseSvg />
          </Pressable>
        </View>
      </View>

      {searchOverlay && (
        <ScrollView style={style.searchContainer}>
          {loading ? (
            <Loader height={50} />
          ) : (
            searchData.map((item, index) => {
              if (!item.distance) {
                return;
              }
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => searchItemPressed(item)}>
                  <SearchItem item={item} />
                </TouchableOpacity>
              );
            })
          )}
          <View style={{width: '100%', height: 20}} />
        </ScrollView>
      )}

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 10,
          opacity,
        }}>
        <Text style={{...TYPO.smallLight}}>Didn't find a location ?</Text>
        <TouchableOpacity
          disabled={
            netinfo.isConnected && appState.currentPosition.length
              ? false
              : true
          }
          style={style.goMapBtn}
          onPress={() => navigation.push('Map')}>
          <Text style={style.goMapText}>Go to Map</Text>
        </TouchableOpacity>
      </View>
      <DatePicker
        modal
        open={openDate}
        date={appState.addListData.date || new Date()}
        onConfirm={date => {
          appDispatch({type: 'dateChange', value: date});
          setOpenDate(false);
        }}
        onCancel={() => {
          setOpenDate(false);
        }}
        minuteInterval={1}
        minimumDate={new Date()}
        theme="light"
      />
      <TouchableOpacity
        style={style.dateContainer}
        activeOpacity={0.5}
        onPress={() => {
          setOpenDate(true);
        }}>
        <Text style={{...TYPO.smallLight}}>
          {appState.addListData.date
            ? getDate(appState.addListData.date)
            : 'Select due date'}
        </Text>
        <Calendar />
      </TouchableOpacity>
      <TouchableOpacity
        disabled={createDisable}
        onPress={createList}
        style={style.createBtn}>
        <Text style={style.createText}>Create</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const style = StyleSheet.create({
  container: {
    backgroundColor: COLORS.lightColor,
    width,
    height,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    elevation: 35,
    padding: 20,
    flex: 1,
  },
  closeIcon: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  formContainer: {
    marginTop: 78 - 20,
  },
  goMapText: {
    fontFamily: FONTS.medium,
    fontSize: 14,
    color: COLORS.accentColor,
  },
  goMapBtn: {
    borderColor: COLORS.accentColor,
    borderRadius: 5,
    borderWidth: 2,
    padding: 13,
  },
  createBtn: {
    backgroundColor: COLORS.accentColor,
    borderRadius: 5,
    paddingHorizontal: 18,
    paddingVertical: 10,
    position: 'absolute',
    top: 0,
    right: 0,
  },
  createText: {
    color: COLORS.lightColor,
    fontFamily: FONTS.bold,
    fontSize: 18,
  },
  searchContainer: {
    maxHeight: 150,
    width: '100%',
    backgroundColor: COLORS.lightColor,
    borderColor: '#DBDBDB',
    borderWidth: 2,
    padding: 10,
    borderTopWidth: 0,
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
  },
  emptySearch: {
    position: 'absolute',
    bottom: 10,
    right: 0,
    transform: [{scale: 0.6}],
    opacity: 0.6,
  },
  dateContainer: {
    borderColor: '#DBDBDB',
    borderWidth: 1,
    padding: 20,
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 5,
  },
});

export default AddList;
