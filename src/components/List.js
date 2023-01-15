import React, {useContext} from 'react';
import {View, Text, StyleSheet, Pressable} from 'react-native';
import {COLORS, TYPO} from '../utils/constants';
import Arrow from '../../assets/svg/arrow.svg';
import Location from '../../assets/svg/location.svg';
import Direction from '../../assets/svg/direction.svg';
import Calendar from '../../assets/svg/calendar.svg';
import {getDistance} from 'geolib';
import {StateContext} from '../utils/context';
import trimText from '../functions/trimText';
import getDate from '../functions/getDate';

const List = ({name, location, index, id, navigation, position, date}) => {
  const appContext = useContext(StateContext);
  const userPosition = appContext.currentPosition;
  const border = index ? 0 : 5;
  function listPressed() {
    navigation.navigate('List', {name, id, position, location});
  }
  const distance =
    position.length > 0 && userPosition.length > 0
      ? getDistance(
          {lat: userPosition[0], lon: userPosition[1]},
          {lat: position[0], lon: position[1]},
        )
      : null;
  return (
    <Pressable
      android_ripple={{color: '#dddddd'}}
      onPress={listPressed}
      style={[
        style.mainContainer,
        {
          elevation: index ? 40 : 0,
          borderTopLeftRadius: border,
          borderTopRightRadius: border,
        },
      ]}>
      <View
        style={{
          alignSelf: 'flex-start',
          marginTop: 12,
          width: '90%',
        }}>
        <View style={style.upperContainer}>
          <Text style={{...TYPO.medium}}>{trimText(name, 18)}</Text>
          {distance && (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Direction />
              <Text style={{...TYPO.smallLight, fontSize: 12, marginLeft: 4}}>
                {distance > 1000
                  ? (distance / 1000).toFixed(1) + ' km'
                  : distance + 'm'}
              </Text>
            </View>
          )}
        </View>

        {location !== '' && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 4,
            }}>
            <Location />
            <Text
              numberOfLines={1}
              style={{...TYPO.smallLight, marginLeft: 4, fontSize: 12}}>
              {trimText(location, 25)}
            </Text>
          </View>
        )}
        {date && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: location !== '' ? 0 : 4,
            }}>
            <Calendar />
            <Text
              numberOfLines={1}
              style={{...TYPO.smallLight, marginLeft: 4, fontSize: 12}}>
              {getDate(date, true)}
            </Text>
          </View>
        )}
      </View>
      <Arrow />
    </Pressable>
  );
};

const style = StyleSheet.create({
  mainContainer: {
    height: 85,
    backgroundColor: COLORS.lightColor,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    alignItems: 'center',
  },
  upperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    //backgroundColor: 'red',
    justifyContent: 'space-between',
  },
});
export default List;