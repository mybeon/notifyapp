import {View} from 'react-native';
import React, {useState, useContext, useEffect} from 'react';
import {COLORS} from '../../utils/constants';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import styles from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AppContext} from '../../utils/context';
import LocalList from './LocalList';
import SharedList from './SharedList';
import listCount from '../../functions/listCount';

const index = props => {
  const {state, dispatch} = useContext(AppContext);
  const localListCount = listCount(state.lists);
  const sharedListCount = listCount(state.lists, false);
  const [tab, setTab] = useState('local');
  const activeMargin = useSharedValue('0%');
  const localText = useSharedValue(COLORS.lightColor);
  const sharedText = useSharedValue(COLORS.mainText);
  const timing = val => {
    return withTiming(val, {
      duration: 400,
      easing: Easing.bezier(0, 0.52, 0.5, 1),
    });
  };
  const animateActive = useAnimatedStyle(() => {
    return {
      marginLeft: activeMargin.value,
    };
  });
  const animateLocalText = useAnimatedStyle(() => {
    return {
      color: localText.value,
    };
  });
  const animateSharedText = useAnimatedStyle(() => {
    return {
      color: sharedText.value,
    };
  });
  function handleTabPressed(type) {
    activeMargin.value = timing(type === 'local' ? '0%' : '50%');
    localText.value = timing(
      type === 'local' ? COLORS.lightColor : COLORS.mainText,
    );
    sharedText.value = timing(
      type === 'local' ? COLORS.mainText : COLORS.lightColor,
    );
    setTab(type);
  }

  useEffect(() => {
    AsyncStorage.getItem('lists')
      .then(res => {
        if (res) {
          const data = JSON.parse(res);
          if (data.length) {
            dispatch({type: 'setLists', data});
          } else {
            dispatch({type: 'setLists', data: []});
          }
        } else {
          dispatch({type: 'setLists', data: []});
        }
      })
      .catch(e => console.log(e));
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.tabsContainer}>
        <Animated.Text
          onPress={handleTabPressed.bind(null, 'local')}
          style={[styles.tabText, animateLocalText]}>
          local ({localListCount})
        </Animated.Text>
        <Animated.Text
          onPress={handleTabPressed.bind(null, 'shared')}
          style={[styles.tabText, animateSharedText]}>
          shared ({sharedListCount})
        </Animated.Text>
        <Animated.View style={[styles.active, animateActive]} />
      </View>
      {tab === 'local' ? (
        <LocalList data={state.lists} navigation={props.navigation} />
      ) : (
        <SharedList navigation={props.navigation} />
      )}
    </View>
  );
};
export default index;
