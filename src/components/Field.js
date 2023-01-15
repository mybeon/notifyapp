import React, {useContext} from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';
import {FONTS, COLORS} from '../utils/constants';
import {DispatchContext} from '../utils/context';

const Field = ({label, placeholder, margin, value, dispatch, edit}) => {
  const appDispatch = useContext(DispatchContext);
  const fieldMargin = margin ? 30 : 0;
  return (
    <View style={{marginTop: fieldMargin}}>
      <Text style={style.label}>{label}</Text>
      <TextInput
        value={value}
        style={[style.input, !value ? style.placeholder : {}]}
        placeholder={placeholder}
        placeholderTextColor={COLORS.lightText}
        onChangeText={value => appDispatch({type: dispatch, value})}
        editable={edit}
      />
    </View>
  );
};

const style = StyleSheet.create({
  label: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    color: COLORS.mainText,
  },
  input: {
    borderBottomWidth: 1,
    fontFamily: FONTS.medium,
    borderBottomColor: '#DBDBDB',
    color: COLORS.mainText,
    fontSize: 14,
    padding: 0,
    paddingVertical: 12,
    marginTop: 2,
    color: '#262626',
  },
  placeholder: {
    fontFamily: FONTS.regular,
  },
});

export default Field;
