import {TouchableOpacity, Text, Alert} from 'react-native';
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {COLORS, TYPO} from '../utils/constants';

const ClearStorage = () => {
  return (
    <TouchableOpacity
      style={{
        backgroundColor: COLORS.danger,
        padding: 5,
        width: '20%',
        borderRadius: 5,
        marginBottom: 5,
      }}
      onPress={() => {
        AsyncStorage.clear().then(() => {
          Alert.alert('clear', 'all data have been cleared', [
            {text: 'Ok', onPress: () => {}},
          ]);
        });
      }}>
      <Text
        style={{
          textAlign: 'center',
          ...TYPO.medium,
          color: COLORS.lightColor,
        }}>
        Clear
      </Text>
    </TouchableOpacity>
  );
};

export default ClearStorage;
