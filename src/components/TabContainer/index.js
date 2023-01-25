import {View} from 'react-native';
import React, {useState, useContext, useEffect} from 'react';
import {COLORS} from '../../utils/constants';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import styles from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {DispatchContext, StateContext} from '../../utils/context';
import LocalList from './LocalList';
import SharedList from './SharedList';
import listCount from '../../functions/listCount';

const index = props => {
  const appDispatch = useContext(DispatchContext);
  const appState = useContext(StateContext);
  const localListCount = listCount(appState.lists);
  const sharedListCount = listCount(appState.lists, false);
  const [tab, setTab] = useState('local');
  const activeMargin = useSharedValue('0%');
  const localText = useSharedValue(COLORS.lightColor);
  const sharedText = useSharedValue(COLORS.mainText);
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
    activeMargin.value = withTiming(type === 'local' ? '0%' : '50%');
    localText.value = withTiming(
      type === 'local' ? COLORS.lightColor : COLORS.mainText,
    );
    sharedText.value = withTiming(
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
            appDispatch({type: 'setLists', data});
          } else {
            appDispatch({type: 'setLists', data: []});
          }
        } else {
          appDispatch({type: 'setLists', data: []});
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
        <LocalList data={appState.lists} navigation={props.navigation} />
      ) : (
        <SharedList data={appState.lists} navigation={props.navigation} />
      )}
    </View>
  );
};
export default index;
