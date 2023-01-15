import {
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import React from 'react';
import Animated, {FadeInDown} from 'react-native-reanimated';
import {COLORS, TYPO} from '../utils/constants';

const {height, width} = Dimensions.get('window');

const UnitModal = props => {
  const units = ['kg', 'g', 'l', 'u', 'm', 'cm'];
  return (
    <Pressable onPress={props.closeModal} style={style.container}>
      <Animated.View style={style.unitContainer} entering={FadeInDown}>
        {units.map(item => {
          return (
            <TouchableOpacity
              onPress={props.selectUnit.bind(null, item)}
              key={item}>
              <Text style={style.unitText}>{item}</Text>
            </TouchableOpacity>
          );
        })}
      </Animated.View>
    </Pressable>
  );
};

const style = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    right: 0,
    height,
    width,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  unitContainer: {
    //height: 300,
    width: 200,
    backgroundColor: COLORS.lightColor,
    borderRadius: 5,
    elevation: 35,
  },
  unitText: {
    padding: 10,
    marginHorizontal: 10,
    borderBottomColor: '#DBDBDB',
    borderBottomWidth: 1,
    ...TYPO.smallLight,
    color: COLORS.mainText,
  },
});

export default UnitModal;
