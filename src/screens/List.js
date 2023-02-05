import {
  View,
  StyleSheet,
  FlatList,
  Keyboard,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
} from 'react-native';
import React, {useRef, useEffect, useContext, useState} from 'react';
import {COLORS} from '../utils/constants';
import Header from '../components/Header';
import Item from '../components/Item';
import AddItem from '../components/AddItem';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  Easing,
  withTiming,
} from 'react-native-reanimated';
import Goto from '../../assets/svg/goto.svg';
import open from 'react-native-open-maps';
import {addItem, updateItem} from '../functions/storage';
import useGetItems from '../hooks/useGetItems';
import {AppContext} from '../utils/context';
import QRcodeGenerator from '../components/QRcodeGenerator';

const List = ({route, navigation}) => {
  const {state} = useContext(AppContext);
  const type = route.params.shared ? 'shared' : 'local';
  const item = state[type].find(item => item.id === route.params.id);
  const shareKey = item.shareKey;
  const position = item.position;
  const shared = item.shared;
  const [openModal, setOpenModal] = useState(false);
  const flatListRef = useRef(null);
  const percentWidth = useSharedValue(0);
  const percentStyle = useAnimatedStyle(() => {
    return {
      width: `${percentWidth.value}%`,
    };
  });

  const [data, setData, loading] = useGetItems(
    route.params.id,
    shared,
    shareKey,
  );

  function handleOpenModal() {
    setOpenModal(true);
  }

  function handleCloseModal() {
    setOpenModal(false);
  }

  useEffect(() => {
    if (loading) return;
    if (data.length) {
      const itemsCount = data.length;
      const checkItems = data.filter(item => item.checked === true).length;
      const percent = Math.floor((checkItems / itemsCount) * 100);
      percentWidth.value = withTiming(percent, {
        duration: 400,
        easing: Easing.bezier(0, 0.52, 0.5, 1),
      });
    } else {
      percentWidth.value = withTiming(0, {
        duration: 400,
        easing: Easing.bezier(0, 0.52, 0.5, 1),
      });
    }
  }, [data]);

  async function handleDelete(id) {
    const newArr = data.filter(filterItem => filterItem.id !== id);
    setData(prev => prev.filter(item => item.id !== id));
    await updateItem(route.params.id, newArr, shared, shareKey);
  }

  async function handlePress(id) {
    const index = data.findIndex(findItem => findItem.id == id);
    const newData = data.slice();
    newData[index].checked = !newData[index].checked;
    setData(newData);
    await updateItem(route.params.id, newData, shared, shareKey);
  }

  function renderItem({item}) {
    return (
      <Item item={item} itemDelete={handleDelete} pressedItem={handlePress} />
    );
  }

  function headerComponent() {
    return (
      <>
        <Header
          name={item.name}
          navigation={navigation}
          shared={shared}
          onOpen={handleOpenModal}
        />
        <View style={style.progressContainer}>
          <View style={style.progressOuter}>
            <Animated.View
              style={[style.progressInner, percentStyle]}></Animated.View>
          </View>
          {position?.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                open({
                  latitude: position[0],
                  longitude: position[1],
                  zoom: 18,
                  mapType: 'standard',
                });
              }}>
              <Goto />
            </TouchableOpacity>
          )}
        </View>
      </>
    );
  }

  function footerComponent() {
    return <View style={{height: 120}}></View>;
  }

  async function handleAddItem(item) {
    flatListRef.current.scrollToOffset({animated: true, offset: 0});
    setData(prev => [item, ...prev]);
    await addItem(route.params.id, item, data, shared, shareKey);
  }

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center'}}>
        <ActivityIndicator
          color={COLORS.mainColor}
          style={style.loader}
          size={50}
        />
      </View>
    );
  }

  return (
    <>
      {shared && (
        <Modal visible={openModal} animationType="fade" transparent={true}>
          <QRcodeGenerator
            data={{id: route.params.id, shareKey, name: item.name}}
            onClose={handleCloseModal}
          />
        </Modal>
      )}
      <View style={style.container}>
        <FlatList
          ref={flatListRef}
          ListHeaderComponent={headerComponent}
          data={data}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={footerComponent}
          initialNumToRender={12}
          onScrollBeginDrag={() => Keyboard.dismiss()}
        />
      </View>
      <AddItem addedItem={handleAddItem} />
    </>
  );
};

const style = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    height: '100%',
  },
  progressOuter: {
    backgroundColor: '#DBDBDB',
    height: 5,
    width: 280,
    borderRadius: 50,
  },
  progressInner: {
    backgroundColor: COLORS.mainColor,
    height: 5,
    borderRadius: 50,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    marginBottom: 30,
  },
});

export default List;
