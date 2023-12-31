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
import uuid from 'react-native-uuid';
import DatePicker from 'react-native-date-picker';
import getDate from '../../functions/getDate';
import {useNetInfo} from '@react-native-community/netinfo';
import config from 'react-native-config';
import {storeList, updateLocalList} from '../../functions/storage';
import {useTranslation} from 'react-i18next';

const CreateList = ({navigation, route, type}) => {
  const netinfo = useNetInfo();
  const {state, dispatch} = useContext(AppContext);
  const {t} = useTranslation();
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
          await storeList(
            newList,
            shared ? 'shared' : 'local',
            state.addListData.date,
          );
          dispatch({
            type: 'updateLists',
            data: newList,
            listType: shared ? 'shared' : 'local',
          });
          navigation.navigate('List', {id: newList.id, shared});
        } else {
          const newArr = await updateLocalList(
            newList,
            state.addListData.date,
            route.params.id,
          );
          dispatch({
            type: 'setLists',
            data: newArr,
            listType: shared ? 'shared' : 'local',
          });
          navigation.navigate('Home');
        }
      } catch (e) {
        dispatch({
          type: 'notification',
          message: t('createListError'),
          success: false,
        });
        console.log('create list error', e);
      }
      dispatch({type: 'clearList'});
    } else {
      dispatch({
        type: 'notification',
        message: t('listNameError'),
        success: false,
      });
    }
    setCreateDisable(false);
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
        .catch(err => {
          dispatch({
            type: 'notification',
            message: t('networkError'),
            success: false,
          });
          console.log(err);
        });
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
          label={t('listNameLabel')}
          placeholder={t('listNamePlaceholder')}
          value={state.addListData.name}
          dispatchType={'nameChange'}
        />
        <View style={{opacity}}>
          <Field
            label={t('listLocationLabel')}
            placeholder={t('listLocationPlaceholder')}
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
        <Text style={{...TYPO.smallLight}}>{t('noLocationAsk')}</Text>
        <TouchableOpacity
          disabled={
            netinfo.isConnected && state.currentPosition.length ? false : true
          }
          style={style.goMapBtn}
          onPress={() => navigation.push('Map')}>
          <Text style={style.goMapText}>{t('goToMap')}</Text>
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
        title={t('dateSelect')}
        confirmText={t('dateConfirm')}
        cancelText={t('dateCancel')}
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
            : t('selectListDate')}
        </Text>
        <Calendar />
      </TouchableOpacity>
      {type === 'create' && (
        <View style={style.sharedContainer}>
          <Text style={style.sharedText}>{t('shared')}</Text>
          <Switch
            disabled={!netinfo.isConnected}
            trackColor={{true: COLORS.mainColor}}
            thumbColor={COLORS.lightColor}
            value={shared}
            onValueChange={() => setShared(prev => !prev)}
          />
        </View>
      )}
      <TouchableOpacity
        disabled={createDisable}
        onPress={createList}
        style={style.createBtn}>
        {createDisable ? (
          <Loader height={22} light={true} />
        ) : (
          <Text style={style.createText}>
            {type === 'create' ? t('listCreate') : t('listUpdate')}
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

export default CreateList;
