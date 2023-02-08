import {Text, StyleSheet} from 'react-native';
import React, {useEffect, useContext} from 'react';
import {COLORS, TYPO} from '../utils/constants';
import {AppContext} from '../utils/context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

const Notification = () => {
  const {
    state: {notification},
  } = useContext(AppContext);
  const y = useSharedValue(-70);
  const opacity = useSharedValue(0);
  const animateView = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{translateY: y.value}],
    };
  });
  useEffect(() => {
    if (notification) {
      y.value = withSpring(0);
      opacity.value = withSpring(1);
      const timeout = setTimeout(() => {
        y.value = withSpring(-70);
        opacity.value = withSpring(0);
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [notification]);
  return (
    <Animated.View
      style={[
        styles.container,
        animateView,
        {
          backgroundColor: notification?.success
            ? COLORS.accentColor
            : COLORS.danger,
        },
      ]}>
      <Text style={styles.text}>{notification?.message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    height: 45,
    width: 200,
    borderRadius: 5,
    top: 15,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    elevation: 15,
  },
  text: {
    ...TYPO.medium,
    fontSize: 12,
    color: COLORS.lightColor,
  },
});

export default Notification;
