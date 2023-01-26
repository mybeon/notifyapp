import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Pressable,
  Switch,
} from 'react-native';
import style from './styles';
import {COLORS, TYPO} from '../../utils/constants';
import CloseSvg from '../../../assets/svg/close.svg';
import Calendar from '../../../assets/svg/calendar-1.svg';
import Field from '../../components/Field';
import {AppContext} from '../../utils/context';
import axios from 'axios';
import SearchItem from '../../components/SearchItem';
import Loader from '../../components/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import DatePicker from 'react-native-date-picker';
import getDate from '../../functions/getDate';
import {
  scheduleNotification,
  cancelNotification,
} from '../../functions/notification';
import {useNetInfo} from '@react-native-community/netinfo';
import config from 'react-native-config';

const CreateList = ({navigation, route, type}) => {
  const netinfo = useNetInfo();
  const {state, dispatch} = useContext(AppContext);
  const opacity = netinfo.isConnected && state.currentPosition.length ? 1 : 0.3;
  const datePickerValue =
    type === 'create'
      ? state.addListData.date
      : new Date(state.addListData.date);
  const [searchData, setSearchData] = useState([]);
  const [searchOverlay, setSearchOverlay] = useState(false);
  const [loading, setLoading] = useState(false);
  const [createDisable, setCreateDisable] = useState(false);
  const [openDate, setOpenDate] = useState(false);
  const [shared, setShared] = useState(false);
  const closeModal = () => {
    navigation.goBack();
    dispatch({type: 'clearList'});
  };
  useEffect(() => {
    if (type === 'edit') {
      dispatch({type: 'nameChange', value: route.params.name});
      dispatch({
        type: 'locationChange',
        value: route.params.locationName,
        search: true,
      });
      dispatch({type: 'setListPosition', value: route.params.position});
      dispatch({type: 'dateChange', value: route.params.date});
    }
  }, []);
  const createList = async () => {
    if (state.addListData.name.trim() !== '') {
      setCreateDisable(true);
      const newList = {
        name: state.addListData.name,
        locationName: state.addListData.location,
        position: state.addListData.position,
        date: state.addListData.date
          ? new Date(state.addListData.date).toString()
          : null,
        notificationId: state.addListData.date
          ? Math.floor(Math.random() * Math.pow(2, 32)).toString()
          : null,
        shared,
      };
      try {
        if (type === 'create') {
          newList.id = uuid.v4();
          let lists = await AsyncStorage.getItem('lists');
          if (!lists) {
            await AsyncStorage.setItem('lists', JSON.stringify([newList]));
          } else {
            lists = JSON.parse(lists);
            await AsyncStorage.setItem(
              'lists',
              JSON.stringify([newList, ...lists]),
            );
          }
          dispatch({type: 'updateLists', data: newList});
          if (newList.date) {
            scheduleNotification(
              state.addListData.date,
              newList.notificationId,
              newList.name,
            );
          }
          navigation.navigate('List', {
            id: newList.id,
            name: newList.name,
            position: newList.position,
          });
        } else {
          const lists = await AsyncStorage.getItem('lists');
          const newArr = JSON.parse(lists).map(item => {
            if (item.id === route.params.id) {
              return {id: item.id, ...newList};
            }
            return item;
          });

          await AsyncStorage.setItem('lists', JSON.stringify(newArr));
          if (newList.date && new Date(newList.date) > Date.now()) {
            cancelNotification(route.params.notificationId);
            scheduleNotification(
              state.addListData.date,
              newList.notificationId,
              newList.name,
            );
          }
          dispatch({type: 'setLists', data: newArr});
          navigation.navigate('Home');
        }
      } catch (e) {
        console.log('create list error', e);
      }
      dispatch({type: 'clearList'});
    }
  };

  useEffect(() => {
    if (
      state.addListData.location.trim() === '' ||
      state.addListData.fromSearch
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
          `https://places.ls.hereapi.com/places/v1/autosuggest?at=31.652366,-8.078394&q=${state.addListData.location}&apiKey=${config.GEO_API}`,
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
  }, [state.addListData.location]);

  function searchItemPressed(item) {
    dispatch({type: 'locationChange', value: item.title, search: true});
    dispatch({type: 'setListPosition', value: item.position});
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
          value={state.addListData.name}
          dispatchType={'nameChange'}
        />
        <View style={{opacity}}>
          <Field
            label="Location"
            placeholder="Choose location"
            margin={true}
            value={state.addListData.location}
            dispatchType={'locationChange'}
            edit={
              netinfo.isConnected && state.currentPosition.length ? true : false
            }
          />
          <Pressable
            style={style.emptySearch}
            onPress={() => dispatch({type: 'locationChange', value: ''})}>
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
            netinfo.isConnected && state.currentPosition.length ? false : true
          }
          style={style.goMapBtn}
          onPress={() => navigation.push('Map')}>
          <Text style={style.goMapText}>Go to Map</Text>
        </TouchableOpacity>
      </View>
      <DatePicker
        modal
        open={openDate}
        date={datePickerValue || new Date()}
        onConfirm={date => {
          dispatch({type: 'dateChange', value: date});
          setOpenDate(false);
        }}
        onCancel={() => {
          setOpenDate(false);
        }}
        minuteInterval={10}
        minimumDate={new Date()}
        theme="light"
      />
      <TouchableOpacity
        disabled={shared}
        style={[style.dateContainer, {opacity: shared ? 0.3 : 1}]}
        activeOpacity={0.5}
        onPress={() => {
          setOpenDate(true);
        }}>
        <Text style={{...TYPO.smallLight}}>
          {state.addListData.date
            ? getDate(state.addListData.date)
            : 'Select due date'}
        </Text>
        <Calendar />
      </TouchableOpacity>
      <View style={style.sharedContainer}>
        <Text style={style.sharedText}>shared</Text>
        <Switch
          trackColor={{true: COLORS.mainColor}}
          thumbColor={COLORS.lightColor}
          value={shared}
          onValueChange={() => setShared(prev => !prev)}
        />
      </View>
      <TouchableOpacity
        disabled={createDisable}
        onPress={createList}
        style={style.createBtn}>
        <Text style={style.createText}>
          {type === 'create' ? 'Create' : 'Update'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default CreateList;
