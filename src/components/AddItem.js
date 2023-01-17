import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Modal,
} from 'react-native';
import React from 'react';
import {useImmer} from 'use-immer';
import DropdownSvg from '../../assets/svg/dropdown.svg';
import {COLORS, FONTS} from '../utils/constants';
import UnitModal from './UnitModal';
import uuid from 'react-native-uuid';

const AddItem = ({addedItem}) => {
  const [state, setState] = useImmer({
    isModalVisible: false,
    unit: 'kg',
    unitNumber: '',
    itemText: '',
  });

  function addItem() {
    if (state.itemText.trim() != '') {
      const newItem = {
        id: uuid.v4(),
        label: state.itemText,
        checked: false,
        number: state.unitNumber,
        units: state.unit,
      };
      addedItem(newItem);
      setState(draft => {
        draft.itemText = '';
        draft.unitNumber = '';
      });
    }
  }

  function handleCloseModal() {
    setState(draft => {
      draft.isModalVisible = false;
    });
  }

  function showModal() {
    setState(draft => {
      draft.isModalVisible = true;
    });
  }

  function handleSelectUnit(item) {
    setState(draft => {
      draft.unit = item;
      draft.isModalVisible = false;
    });
  }

  return (
    <View style={style.addItem}>
      <View style={style.inputMainContainer}>
        <TextInput
          placeholderTextColor={COLORS.lightText}
          style={style.textInput}
          placeholder="Add item"
          value={state.itemText}
          onChangeText={val =>
            setState(draft => {
              draft.itemText = val;
            })
          }
          onSubmitEditing={addItem}
        />

        <View style={{flexDirection: 'row', alignItems: 'center', flex: 2}}>
          <TextInput
            placeholderTextColor={COLORS.lightText}
            style={style.textInput}
            placeholder="Number"
            keyboardType="number-pad"
            value={state.unitNumber}
            onChangeText={val =>
              setState(draft => {
                draft.unitNumber = val;
              })
            }
          />

          <Pressable onPress={showModal} style={style.unitsModalContainer}>
            <Text style={style.unitText}>{state.unit}</Text>
            <DropdownSvg />
          </Pressable>
        </View>
      </View>

      <TouchableOpacity
        style={style.addItemBtn}
        activeOpacity={0.6}
        onPress={addItem}>
        <Text
          style={{
            fontFamily: FONTS.medium,
            color: 'white',
            textTransform: 'capitalize',
            textAlign: 'center',
          }}>
          add item
        </Text>
      </TouchableOpacity>
      <Modal
        visible={state.isModalVisible}
        animationType="fade"
        transparent={true}>
        <UnitModal
          closeModal={handleCloseModal}
          selectUnit={handleSelectUnit}
        />
      </Modal>
    </View>
  );
};

const style = StyleSheet.create({
  addItemBtn: {
    backgroundColor: COLORS.accentColor,
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: '100%',
  },
  inputMainContainer: {
    flex: 1,
    paddingRight: 40,
    flexDirection: 'row',
    width: '100%',
  },
  addItem: {
    backgroundColor: COLORS.lightColor,
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    paddingHorizontal: 22,
    paddingTop: 10,
    paddingBottom: 14,
    elevation: 35,
    alignItems: 'flex-end',
  },
  textInput: {
    fontFamily: FONTS.regular,
    borderBottomWidth: 1,
    borderBottomColor: '#DBDBDB',
    color: COLORS.mainText,
    fontSize: 14,
    padding: 0,
    color: '#262626',
    flex: 3,
  },
  unitContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  unitLabel: {
    fontFamily: FONTS.medium,
    fontSize: 16,
    color: COLORS.mainText,
    marginRight: 16,
  },
  unitsModalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
  },
  unitText: {
    fontFamily: FONTS.regular,
    color: COLORS.mainText,
    fontSize: 14,
    marginRight: 4,
  },
});

export default AddItem;
