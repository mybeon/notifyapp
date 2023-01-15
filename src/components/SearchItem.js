import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {FONTS, COLORS} from '../utils/constants';

const SearchItem = ({item}) => {
  return (
    <View style={style.searchItem}>
      <View
        style={{flexDirection: 'row', alignItems: 'flex-end', width: '60%'}}>
        <Text
          numberOfLines={1}
          style={[style.searchItemText, {color: COLORS.mainText}]}>
          {item.title},{' '}
        </Text>
        <Text numberOfLines={1} style={[style.searchItemText, {fontSize: 12}]}>
          {item.categoryTitle}
        </Text>
      </View>
      {item.distance && (
        <Text style={[style.searchItemText, {fontSize: 12}]}>
          {Math.floor(item.distance / 1000)} km
        </Text>
      )}
    </View>
  );
};

const style = StyleSheet.create({
  searchItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  searchItemText: {
    fontFamily: FONTS.regular,
  },
});

export default SearchItem;
