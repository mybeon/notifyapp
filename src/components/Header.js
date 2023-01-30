import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import BackBtn from '../../assets/svg/back-header.svg';
import {COLORS, FONTS} from '../utils/constants';
import trimText from '../functions/trimText';
import QRcode from '../../assets/svg/QRcode';

const Header = ({name, navigation, shared, onOpen}) => {
  return (
    <View style={style.container}>
      <View style={style.leftContainer}>
        <TouchableOpacity
          style={{
            transform: [{translateY: 1}],
            paddingVertical: 8,
            paddingRight: 18,
          }}
          onPress={() => navigation.navigate('Home')}>
          <BackBtn />
        </TouchableOpacity>
        <Text style={style.text}>{trimText(name, 18)}</Text>
      </View>
      {shared && (
        <TouchableOpacity onPress={onOpen}>
          <QRcode />
        </TouchableOpacity>
      )}
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 22,
    justifyContent: 'space-between',
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontFamily: FONTS.medium,
    fontSize: 28,
    color: COLORS.mainText,
    textTransform: 'capitalize',
  },
});

export default Header;
