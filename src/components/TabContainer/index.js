import {View} from 'react-native';
import React, {useState} from 'react';
import {COLORS} from '../../utils/constants';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import styles from './styles';
import LocalList from './LocalList';
import SharedList from './SharedList';
import useGetListsCount from '../../hooks/useGetListsCount';
import {useNetInfo} from '@react-native-community/netinfo';
import NoInternet from '../NoInternet';

const index = props => {
  const [tab, setTab] = useState('local');
  const netinfo = useNetInfo();
  const count = useGetListsCount();
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

  const sharedComponent = netinfo.isConnected ? (
    <SharedList navigation={props.navigation} />
  ) : (
    <NoInternet height={200} />
  );

  return (
    <View style={styles.container}>
      <View style={styles.tabsContainer}>
        <Animated.Text
          onPress={handleTabPressed.bind(null, 'local')}
          style={[styles.tabText, animateLocalText]}>
          local ({count.local})
        </Animated.Text>
        <Animated.Text
          onPress={handleTabPressed.bind(null, 'shared')}
          style={[styles.tabText, animateSharedText]}>
          shared ({count.shared})
        </Animated.Text>
        <Animated.View style={[styles.active, animateActive]} />
      </View>
      {tab === 'local' ? (
        <LocalList navigation={props.navigation} />
      ) : (
        sharedComponent
      )}
    </View>
  );
};
export default index;
