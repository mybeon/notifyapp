import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import BackBtn from '../../assets/svg/back-header.svg';
import {COLORS, FONTS} from '../utils/constants';
import trimText from '../functions/trimText';
import QRcode from '../../assets/svg/QRcode';

const Header = ({name, navigation, shared = false, onOpen}) => {
  return (
    <View style={style.container}>
      <TouchableOpacity
        style={style.backBtn}
        onPress={() => navigation.navigate('Home')}>
        <BackBtn />
      </TouchableOpacity>
      <Text style={style.text}>{trimText(name, 17)}</Text>
      {shared && (
        <TouchableOpacity onPress={onOpen} style={style.qrBtn}>
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
  },
  text: {
    fontFamily: FONTS.medium,
    fontSize: 28,
    color: COLORS.mainText,
    textTransform: 'capitalize',
  },
  backBtn: {transform: [{translateY: 1}], paddingVertical: 8, paddingRight: 18},
  qrBtn: {
    marginLeft: 22,
  },
});

export default Header;
