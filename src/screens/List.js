import {
  View,
  StyleSheet,
  FlatList,
  Keyboard,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, {useRef, useState, useEffect} from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import Goto from '../../assets/svg/goto.svg';
import open from 'react-native-open-maps';

const List = ({route, navigation}) => {
  const position = route.params.position;

  const flatListRef = useRef(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const percentWidth = useSharedValue(0);
  const percentStyle = useAnimatedStyle(() => {
    return {
      width: `${percentWidth.value}%`,
    };
  });
  useEffect(() => {
    (async () => {
      try {
        const items = await AsyncStorage.getItem(`items-${route.params.id}`);
        setLoading(false);
        if (items) {
          setData(JSON.parse(items));
        }
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);

  useEffect(() => {
    if (!data.length) return;
    const itemsCount = data.length;
    const checkItems = data.filter(item => item.checked === true).length;
    const percent = Math.floor((checkItems / itemsCount) * 100);
    percentWidth.value = withTiming(percent, {
      duration: 400,
      easing: Easing.bezier(0, 0.52, 0.5, 1),
    });
  }, [data]);

  async function handleDelete(id) {
    const newArr = data.filter(filterItem => filterItem.id !== id);
    await AsyncStorage.setItem(
      `items-${route.params.id}`,
      JSON.stringify(newArr),
    );
    setData(prev => prev.filter(item => item.id !== id));
  }

  async function handlePress(id) {
    const index = data.findIndex(findItem => findItem.id == id);
    const newData = data.slice();
    newData[index].checked = !newData[index].checked;
    await AsyncStorage.setItem(
      `items-${route.params.id}`,
      JSON.stringify(newData),
    );
    setData(newData);
  }

  function renderItem({item}) {
    return (
      <Item item={item} itemDelete={handleDelete} pressedItem={handlePress} />
    );
  }

  function headerComponent() {
    return (
      <>
        <Header name={route.params.name} navigation={navigation} />
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
    await AsyncStorage.setItem(
      `items-${route.params.id}`,
      JSON.stringify([item, ...data]),
    );
    setData(prev => [item, ...prev]);
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
